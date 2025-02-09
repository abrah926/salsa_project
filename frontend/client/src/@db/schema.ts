import { z } from "zod";

export interface Event {
  id: number;
  event_date: string | null;
  day: string | null;
  time: string | null;
  end_time: string | null;
  name: string | null;
  location: string | null;
  source: string | null;
  price: string | null;
  details: string | null;
  recurrence: "Daily" | "Weekly" | "Monthly" | null;
  recurrence_interval: number | null;
  end_recurring_date: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  end_date: string | null;
  phone_number: string | null;
  map_location?: {
    latitude: number;
    longitude: number;
  } | null;
}

export const insertEventSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.date().optional(),
  time: z.string(),
  venue: z.string(),
  imageUrl: z.string(),
  price: z.string(),
  recurring: z.string(),
  source: z.string()
}); 