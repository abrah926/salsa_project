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
  
  // Set default date to 2025 since all events are in 2025
  const defaultDate = new Date('2025-02-01');

  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async () => {
      const data = await fetchEvents();
      return data.map(event => ({
        ...event,
        event_date: event.event_date ? new Date(event.event_date).toISOString().split('T')[0] : null
      }));
    }
  });

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;

    // Ensure we're using 2025 as the year and normalize to local timezone
    const dateIn2025 = new Date(date);
    dateIn2025.setFullYear(2025);
    
    // Format selected date to YYYY-MM-DD
    const selectedDate = dateIn2025.toISOString().split('T')[0];
    
    console.log('Selected date:', selectedDate);
    
    const eventsOnDate = events.filter(event => {
      if (!event.event_date) return false;
      
      // Direct string comparison of YYYY-MM-DD
      const matches = event.event_date === selectedDate;
      console.log('Comparing:', {
        event_date: event.event_date,
        selectedDate,
        matches,
        eventName: event.name
      });
      return matches;
    });

    console.log('Found events:', eventsOnDate);

    if (eventsOnDate.length > 0) {
      setLocation(`/events/${eventsOnDate[0].id}`);
    } else {
      setNoEventsDate(dateIn2025);
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

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 bg-black/95 flex flex-col overflow-hidden"
    >
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-center px-6 py-4">
          <span className="text-xl font-medium text-white/90">Calendar</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <Calendar
          mode="single"
          onSelect={handleSelect}
          defaultMonth={defaultDate}
          className="rounded-md border border-white/10 bg-black/50 backdrop-blur-md p-4 scale-125"
        />

        {noEventsDate && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-white/80 text-center"
          >
            <p>No events available on {format(noEventsDate, 'MMMM d, yyyy')}</p>
            <p className="text-sm mt-2 text-white/60">
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CalendarPage;