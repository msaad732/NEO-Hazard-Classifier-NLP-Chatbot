import { type User, type InsertUser, type EarthquakeEvent, type TsunamiAlert } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getEarthquakes(): Promise<EarthquakeEvent[]>;
  setEarthquakes(earthquakes: EarthquakeEvent[]): Promise<void>;
  getTsunamiAlerts(): Promise<TsunamiAlert[]>;
  setTsunamiAlerts(alerts: TsunamiAlert[]): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private earthquakes: EarthquakeEvent[] = [];
  private tsunamiAlerts: TsunamiAlert[] = [];

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getEarthquakes(): Promise<EarthquakeEvent[]> {
    return this.earthquakes;
  }

  async setEarthquakes(earthquakes: EarthquakeEvent[]): Promise<void> {
    this.earthquakes = earthquakes;
  }

  async getTsunamiAlerts(): Promise<TsunamiAlert[]> {
    return this.tsunamiAlerts;
  }

  async setTsunamiAlerts(alerts: TsunamiAlert[]): Promise<void> {
    this.tsunamiAlerts = alerts;
  }
}

export const storage = new MemStorage();
