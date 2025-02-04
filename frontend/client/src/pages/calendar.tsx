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
              Swipe left or right to see nearest available events
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CalendarPage;