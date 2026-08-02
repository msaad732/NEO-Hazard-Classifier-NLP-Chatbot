import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { type EarthquakeEvent, type TsunamiAlert, mlPredictionInputSchema, type MLPredictionInput, type MLPredictionOutput } from "@shared/schema";

async function fetchEarthquakes(): Promise<EarthquakeEvent[]> {
  try {
    const response = await fetch(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
    );
    const data = await response.json();
    
    const earthquakes: EarthquakeEvent[] = data.features.map((feature: any) => ({
      id: feature.id,
      magnitude: feature.properties.mag || 0,
      location: feature.properties.place || 'Unknown location',
      depth: feature.geometry.coordinates[2] || 0,
      time: feature.properties.time,
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
      url: feature.properties.url || '',
      tsunami: feature.properties.tsunami === 1,
      felt: feature.properties.felt || null,
      significance: feature.properties.sig || 0,
    }));

    return earthquakes.sort((a, b) => b.time - a.time);
  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    return [];
  }
}

async function fetchTsunamiAlerts(): Promise<TsunamiAlert[]> {
  try {
    const alerts: TsunamiAlert[] = [];
    
    const response = await fetch(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
    );
    const data = await response.json();
    
    const tsunamiEvents = data.features.filter((feature: any) => 
      feature.properties.tsunami === 1
    );

    for (const event of tsunamiEvents) {
      alerts.push({
        id: event.id,
        event: event.properties.place || 'Tsunami Event',
        severity: event.properties.mag >= 7.5 ? 'warning' : 
                  event.properties.mag >= 7.0 ? 'watch' : 
                  event.properties.mag >= 6.5 ? 'advisory' : 'information',
        areas: [event.properties.place || 'Unknown'],
        issueTime: event.properties.time,
        expires: null,
        waveHeight: event.properties.mag >= 7.5 ? '3-10m' : 
                    event.properties.mag >= 7.0 ? '1-3m' : '0.5-1m',
        message: `Earthquake of magnitude ${event.properties.mag} detected. Tsunami possible.`,
        url: event.properties.url || '',
      });
    }

    return alerts.sort((a, b) => b.issueTime - a.issueTime);
  } catch (error) {
    console.error('Error fetching tsunami data:', error);
    return [];
  }
}

/**
 * Local heuristic used when the trained model is unreachable.
 *
 * Every figure here is derived from the caller's own inputs, so the same request
 * always yields the same answer and the reported probability cannot contradict
 * the reported risk level. The result is tagged `source: 'fallback'` so the UI
 * can label it instead of passing it off as a model output.
 */
function buildFallbackPrediction(input: MLPredictionInput): MLPredictionOutput {
  const { diameter, velocity, distance, mass, trajectoryAngle } = input;

  // Kinetic energy in megatons TNT, from the stated mass and speed.
  const velocityMs = velocity * 1000;
  const estimatedEnergy = (0.5 * mass * velocityMs ** 2) / 4.184e15;

  // Closer approaches and steeper trajectories score higher. Bounded to 0-100.
  const proximityScore = Math.min(1, 384_400 / Math.max(distance, 1));
  const angleScore = Math.sin((trajectoryAngle * Math.PI) / 180);
  const sizeScore = Math.min(1, diameter / 10);
  const impactProbability = Number(
    (Math.min(1, proximityScore * (0.55 + 0.45 * angleScore) * (0.35 + 0.65 * sizeScore)) * 100)
      .toFixed(2),
  );

  const riskLevel: MLPredictionOutput['riskLevel'] =
    estimatedEnergy >= 1e5 || impactProbability >= 75
      ? 'critical'
      : estimatedEnergy >= 1e3 || impactProbability >= 40
        ? 'high'
        : estimatedEnergy >= 10 || impactProbability >= 10
          ? 'medium'
          : 'low';

  const damage: Record<MLPredictionOutput['riskLevel'], string> = {
    low: 'Airburst likely. Limited ground effects.',
    medium: 'City-scale destruction near the impact point.',
    high: 'Regional devastation and measurable climate effects.',
    critical: 'Global effects comparable to a mass-extinction impactor.',
  };

  const action: Record<MLPredictionOutput['riskLevel'], string> = {
    low: 'Continue routine tracking.',
    medium: 'Increase observation cadence and prepare civil response plans.',
    high: 'Begin deflection mission planning and regional evacuation studies.',
    critical: 'Immediate deflection mission and international coordination required.',
  };

  return {
    impactProbability,
    riskLevel,
    potentialDamage: damage[riskLevel],
    recommendedAction: action[riskLevel],
    estimatedEnergy: Number(estimatedEnergy.toFixed(2)),
    source: 'fallback',
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get('/api/earthquakes', async (req, res) => {
    try {
      let earthquakes = await storage.getEarthquakes();
      
      if (earthquakes.length === 0) {
        earthquakes = await fetchEarthquakes();
        await storage.setEarthquakes(earthquakes);
      }
      
      res.json(earthquakes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch earthquakes' });
    }
  });

  app.get('/api/earthquakes/refresh', async (req, res) => {
    try {
      const earthquakes = await fetchEarthquakes();
      await storage.setEarthquakes(earthquakes);
      res.json(earthquakes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to refresh earthquakes' });
    }
  });

  app.get('/api/tsunami-alerts', async (req, res) => {
    try {
      let alerts = await storage.getTsunamiAlerts();
      
      if (alerts.length === 0) {
        alerts = await fetchTsunamiAlerts();
        await storage.setTsunamiAlerts(alerts);
      }
      
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tsunami alerts' });
    }
  });

  app.get('/api/tsunami-alerts/refresh', async (req, res) => {
    try {
      const alerts = await fetchTsunamiAlerts();
      await storage.setTsunamiAlerts(alerts);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to refresh tsunami alerts' });
    }
  });

  app.post('/api/chatbot', async (req, res) => {
    try {
      const { question } = req.body;
      
      if (!question) {
        return res.status(400).json({ error: 'Question is required' });
      }

      const response = await fetch('https://chatbot-nasa-7ikr.onrender.com/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chatbot');
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error calling chatbot API:', error);
      res.status(500).json({ error: 'Failed to get chatbot response' });
    }
  });

  app.post('/api/ml/predict', async (req, res) => {
    try {
      const validationResult = mlPredictionInputSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: 'Invalid prediction parameters', 
          details: validationResult.error.errors 
        });
      }

      const { diameter, velocity, distance, mass, trajectoryAngle } = validationResult.data;

      let response;
      try {
        response = await fetch('https://ms732.pythonanywhere.com/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            diameter,
            velocity,
            distance,
            mass,
            trajectory_angle: trajectoryAngle,
          }),
          redirect: 'follow',
        });
      } catch (fetchError: any) {
        console.error('ML model unreachable, using local heuristic:', fetchError.message);
        return res.json(buildFallbackPrediction(validationResult.data));
      }

      if (!response.ok) {
        console.warn(`ML model returned ${response.status}, using local heuristic`);
        return res.json(buildFallbackPrediction(validationResult.data));
      }

      // The upstream may answer 200 with an HTML app shell rather than JSON.
      // Treat anything unparseable as unavailable instead of surfacing a crash.
      let rawData: any;
      try {
        rawData = await response.json();
      } catch {
        console.warn('ML model returned a non-JSON body, using local heuristic');
        return res.json(buildFallbackPrediction(validationResult.data));
      }

      const transformedData: MLPredictionOutput = {
        impactProbability: Number(rawData.impact_probability ?? rawData.impactProbability) || 0,
        riskLevel: (rawData.risk_level || rawData.riskLevel || 'low') as 'low' | 'medium' | 'high' | 'critical',
        potentialDamage: String(rawData.potential_damage || rawData.potentialDamage || 'Unknown'),
        recommendedAction: String(rawData.recommended_action || rawData.recommendedAction || 'Monitor closely'),
        estimatedEnergy: rawData.estimated_energy ?? rawData.estimatedEnergy
          ? Number(rawData.estimated_energy ?? rawData.estimatedEnergy)
          : undefined,
        source: 'model',
      };

      res.json(transformedData);
    } catch (error) {
      console.error('Error calling ML model API:', error);
      res.status(500).json({ error: 'Failed to get ML prediction' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
