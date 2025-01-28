import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { events } from "@db/schema";
import { eq } from "drizzle-orm";
import { format } from "date-fns";
import type { Event } from "@db/schema";

interface TransformedEvent {
  id: string | null;
  title: string | null;
  eventDate: Date | null;
  name: string | null;
  location: string | null;
  details: string | null;
  imageUrl: string | null;
  time: string | null;
  day: string | null;
  source: string | null;
  price: string | null;
  recurrence: string | null;
  recurrenceInterval: number | null;
  endRecurringDate: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export function registerRoutes(app: Express): Server {
  // Get all events
  app.get("/api/events", async (_req, res) => {
    try {
      const allEvents = await db.query.events.findMany({
        orderBy: (events) => [events.event_date],
      });
      
      const formattedEvents = allEvents.map(event => ({
        ...event,
        eventDate: event.event_date,
        day: event.day?.toUpperCase(),
      }));
      
      res.json(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  });

  // Get single event
  app.get("/api/events/:id", async (req, res) => {
    const event = await db.query.events.findFirst({
      where: eq(events.id, req.params.id),
    });
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    res.json(transformEventData(event));
  });

  // Create event
  app.post("/api/events", async (req, res) => {
    try {
      const newEvent = await db.insert(events).values(req.body).returning();
      res.status(201).json(newEvent[0]);
    } catch (error) {
      res.status(400).json({ message: "Invalid event data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function
function transformEventData(event: Event): TransformedEvent {
  const parsedDate = event.event_date ? new Date(event.event_date) : null;
  
  return {
    ...event,
    id: event.id || null,
    eventDate: parsedDate,
    title: event.name || null,
    name: event.name || null,
    day: event.day || null,
    time: event.time || null,
    location: event.location || null,
    source: event.source || null,
    price: event.price || null,
    details: event.details || null,
    recurrence: event.recurrence || null,
    recurrenceInterval: event.recurrenceInterval || null,
    endRecurringDate: event.endRecurringDate || null,
    imageUrl: event.imageUrl || null,
    createdAt: event.createdAt || null,
    updatedAt: event.updatedAt || null
  };
}
