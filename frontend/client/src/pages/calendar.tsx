import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";
import { pageTransition } from "@/components/animations";
import fetchEvents from "@/hooks/useEvents";
import { type Event } from "@db/schema";
import { format } from "date-fns";

const CalendarPage = () => {
  const [, setLocation] = useLocation();
  const [noEventsDate, setNoEventsDate] = useState<Date | null>(null);
  
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: fetchEvents
  });

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;

    const selectedDate = date.toISOString().split('T')[0];
    
    // Find ONLY events that match the exact selected date
    const eventsOnDate = events.filter(event => 
      event.event_date && typeof event.event_date === 'string' && event.event_date === selectedDate
    );

    if (eventsOnDate.length > 0) {
      // If events exist on selected date, show first event
      setLocation(`/events/${eventsOnDate[0].id}`);
    } else {
      // If no events on selected date, show message
      setNoEventsDate(date);
    }
  };

  // Find next available event date (only when swiping from no-events message)
  const findNextEvent = (fromDate: Date) => {
    const nextEvent = events
      .filter(event => event.event_date && new Date(event.event_date) > fromDate)
      .sort((a, b) => 
        new Date(a.event_date!).getTime() - new Date(b.event_date!).getTime()
      )[0];

    if (nextEvent) {
      setLocation(`/events/${nextEvent.id}`);
      setNoEventsDate(null);
    }
  };

  // Find previous available event date (only when swiping from no-events message)
  const findPreviousEvent = (fromDate: Date) => {
    const prevEvent = events
      .filter(event => event.event_date && new Date(event.event_date) < fromDate)
      .sort((a, b) => 
        new Date(b.event_date!).getTime() - new Date(a.event_date!).getTime()
      )[0];
    
    if (prevEvent) {
      setLocation(`/events/${prevEvent.id}`);
      setNoEventsDate(null);
    }
  };

  // ... rest of the component code remains unchanged ...
};

export default CalendarPage;