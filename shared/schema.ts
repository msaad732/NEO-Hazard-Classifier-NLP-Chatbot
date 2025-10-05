import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const earthquakeEventSchema = z.object({
  id: z.string(),
  magnitude: z.number(),
  location: z.string(),
  depth: z.number(),
  time: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  url: z.string(),
  tsunami: z.boolean(),
  felt: z.number().nullable(),
  significance: z.number(),
});

export type EarthquakeEvent = z.infer<typeof earthquakeEventSchema>;

export const tsunamiAlertSchema = z.object({
  id: z.string(),
  event: z.string(),
  severity: z.enum(['warning', 'watch', 'advisory', 'information']),
  areas: z.array(z.string()),
  issueTime: z.number(),
  expires: z.number().nullable(),
  waveHeight: z.string().nullable(),
  message: z.string(),
  url: z.string(),
});

export type TsunamiAlert = z.infer<typeof tsunamiAlertSchema>;

export const mlPredictionInputSchema = z.object({
  diameter: z.number().min(0.001).max(1000),
  velocity: z.number().min(0.1).max(100),
  distance: z.number().min(1).max(1000000),
  mass: z.number().min(1).max(1e15),
  trajectoryAngle: z.number().min(0).max(90),
});

export type MLPredictionInput = z.infer<typeof mlPredictionInputSchema>;

export const mlPredictionOutputSchema = z.object({
  impactProbability: z.number(),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
  potentialDamage: z.string(),
  recommendedAction: z.string(),
  estimatedEnergy: z.number().optional(),
});

export type MLPredictionOutput = z.infer<typeof mlPredictionOutputSchema>;
