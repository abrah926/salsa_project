import { pgTable, text, serial, timestamp, uuid, time, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const events = pgTable("salsas", {
  id: uuid("id").defaultRandom().primaryKey(),
  event_date: date("event_date"),
  day: text("day"),
  time: time("time"),
  name: text("name"),
  location: text("location"),
  source: text("source"),
  price: text("price"),
  details: text("details"),
  recurrence: text("recurrence"),
  recurrenceInterval: integer("recurrence_interval").default(1),
  endRecurringDate: timestamp("end_recurring_date"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define the recurrence enum type
export const RecurrenceType = z.enum(["DAILY", "WEEKLY", "MONTHLY"]);

// Create Zod schemas for validation
export const insertEventSchema = createInsertSchema(events, {
  recurrence: RecurrenceType.optional(),
  event_date: z.date().optional(),
  day: z.string().optional(),
  time: z.string().optional(),
  name: z.string().optional(),
  location: z.string().optional(),
  source: z.string().optional(),
  price: z.string().optional(),
  details: z.string().optional(),
  recurrenceInterval: z.number().min(1).optional(),
  endRecurringDate: z.date().optional(),
  imageUrl: z.string().url().optional(),
});

export const selectEventSchema = createSelectSchema(events);

// Update Event type to include both field names for compatibility
export interface Event {
  id: string;
  event_date: Date | null;  // Database field
  eventDate: Date | null;   // Frontend field (for compatibility)
  day: string | null;
  time: string | null;
  name: string | null;
  location: string | null;
  source: string | null;
  price: string | null;
  details: string | null;
  recurrence: string | null;
  recurrenceInterval: number | null;
  endRecurringDate: Date | null;
  imageUrl: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

// Remove the automatic type inference
// export type Event = typeof events.$inferSelect;

export type NewEvent = typeof events.$inferInsert;