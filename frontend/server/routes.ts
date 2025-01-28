import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { events } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Get all events
  app.get("/api/events", async (_req, res) => {
    const allEvents = await db.query.events.findMany({
      orderBy: (events) => [events.eventDate],
    });
    
    // Ensure dates are properly formatted
    const formattedEvents = allEvents.map(event => ({
      ...event,
      eventDate: event.eventDate instanceof Date ? event.eventDate.toISOString() : null,
      date: event.eventDate instanceof Date ? event.eventDate.toISOString() : null
    }));
    
    res.json(formattedEvents);
  });

  // Get single event
  app.get("/api/events/:id", async (req, res) => {
    const event = await db.query.events.findFirst({
      where: eq(events.id, req.params.id),
    });
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    res.json(event);
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
