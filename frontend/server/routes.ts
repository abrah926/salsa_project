import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "../db";
import { events } from "../db/schema";
import { eq } from "drizzle-orm";
import { type Event } from "@db/schema";

export function registerRoutes(app: Express): Server {
  // Get all events
  app.get("/api/events", async (_req, res) => {
    try {
      const allEvents = await db.query.events.findMany({
        orderBy: (events) => [events.event_date],
      });
      
      const mappedEvents = allEvents.map(event => ({
        ...event,
        eventDate: event.event_date,  // Transform here
        title: event.name  // Add title for frontend compatibility
      }));
      
      res.json(mappedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  });

  // Get single event
  app.get("/api/events/:id", async (req, res) => {
    // Log the SQL query before executing it
    const query = db.query.events.findFirst({
      where: eq(events.id, req.params.id),
    });
    
    console.log('SQL Query:', query.toSQL());  // Add this
    
    const event = await query;
    
    console.log('Raw DB query result:', {
      event: event,
      event_date: event?.event_date,
      hasProperty: 'event_date' in (event || {}),
      keys: event ? Object.keys(event) : [],
      values: event ? Object.values(event) : []  // Add this too
    });
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    // Transform snake_case to camelCase
    const mappedEvent = {
      ...event,
      eventDate: event.event_date,  // Transform here
      title: event.name  // Add title for frontend compatibility
    };
    
    console.log('Mapped event:', mappedEvent);
    res.json(mappedEvent);
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
