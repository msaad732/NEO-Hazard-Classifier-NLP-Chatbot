import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { type EarthquakeEvent, type TsunamiAlert } from "@shared/schema";

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

  const httpServer = createServer(app);

  return httpServer;
}
