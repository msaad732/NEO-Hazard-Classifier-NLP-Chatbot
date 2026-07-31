import { type EarthquakeEvent, type TsunamiAlert, mlPredictionInputSchema, type MLPredictionInput, type MLPredictionOutput } from "./shared/schema";

interface WorkerEnv {
  CACHE: KVNamespace;
}

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

function buildFallbackPrediction(input: MLPredictionInput): MLPredictionOutput {
  const { diameter, velocity, distance, mass, trajectoryAngle } = input;

  const velocityMs = velocity * 1000;
  const estimatedEnergy = (0.5 * mass * velocityMs ** 2) / 4.184e15;

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

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // GET /api/earthquakes
      if (url.pathname === '/api/earthquakes' && request.method === 'GET') {
        const cached = await env.CACHE.get('earthquakes');
        if (cached) {
          return new Response(cached, {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }

        const earthquakes = await fetchEarthquakes();
        await env.CACHE.put('earthquakes', JSON.stringify(earthquakes), { expirationTtl: 3600 });
        return new Response(JSON.stringify(earthquakes), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // GET /api/earthquakes/refresh
      if (url.pathname === '/api/earthquakes/refresh' && request.method === 'GET') {
        const earthquakes = await fetchEarthquakes();
        await env.CACHE.put('earthquakes', JSON.stringify(earthquakes), { expirationTtl: 3600 });
        return new Response(JSON.stringify(earthquakes), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // GET /api/tsunami-alerts
      if (url.pathname === '/api/tsunami-alerts' && request.method === 'GET') {
        const cached = await env.CACHE.get('tsunami-alerts');
        if (cached) {
          return new Response(cached, {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }

        const alerts = await fetchTsunamiAlerts();
        await env.CACHE.put('tsunami-alerts', JSON.stringify(alerts), { expirationTtl: 3600 });
        return new Response(JSON.stringify(alerts), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // GET /api/tsunami-alerts/refresh
      if (url.pathname === '/api/tsunami-alerts/refresh' && request.method === 'GET') {
        const alerts = await fetchTsunamiAlerts();
        await env.CACHE.put('tsunami-alerts', JSON.stringify(alerts), { expirationTtl: 3600 });
        return new Response(JSON.stringify(alerts), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // POST /api/chatbot
      if (url.pathname === '/api/chatbot' && request.method === 'POST') {
        const body = await request.json();
        const { question } = body;

        if (!question) {
          return new Response(JSON.stringify({ error: 'Question is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }

        const response = await fetch('https://chatbot-nasa-7ikr.onrender.com/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response from chatbot');
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // POST /api/ml/predict
      if (url.pathname === '/api/ml/predict' && request.method === 'POST') {
        const body = await request.json();
        const validationResult = mlPredictionInputSchema.safeParse(body);

        if (!validationResult.success) {
          return new Response(
            JSON.stringify({
              error: 'Invalid prediction parameters',
              details: validationResult.error.errors,
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            }
          );
        }

        const { diameter, velocity, distance, mass, trajectoryAngle } = validationResult.data;

        try {
          const response = await fetch('https://nasa-hackathon-ml-model.streamlit.app/predict', {
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

          if (!response.ok) {
            console.warn(`ML model returned ${response.status}, using local heuristic`);
            return new Response(JSON.stringify(buildFallbackPrediction(validationResult.data)), {
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          }

          let rawData: any;
          try {
            rawData = await response.json();
          } catch {
            console.warn('ML model returned a non-JSON body, using local heuristic');
            return new Response(JSON.stringify(buildFallbackPrediction(validationResult.data)), {
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
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

          return new Response(JSON.stringify(transformedData), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        } catch (error) {
          console.error('Error calling ML model API:', error);
          return new Response(JSON.stringify(buildFallbackPrediction(validationResult.data)), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }
      }

      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  },
};
