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
    
    // Find events on selected date
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

  // Find next available event date
  const findNextEvent = (fromDate: Date) => {
    const nextEvent = events.find(event => 
      event.event_date && new Date(event.event_date) > fromDate
    );
    if (nextEvent) {
      setLocation(`/events/${nextEvent.id}`);
      setNoEventsDate(null);
    }
  };

  // Find previous available event date
  const findPreviousEvent = (fromDate: Date) => {
    const prevEvent = [...events]
      .sort((a, b) => new Date(b.event_date!).getTime() - new Date(a.event_date!).getTime())
      .find(event => event.event_date && new Date(event.event_date) < fromDate);
    
    if (prevEvent) {
      setLocation(`/events/${prevEvent.id}`);
      setNoEventsDate(null);
    }
  };

  // Handle touch events for swipe when no events
  useEffect(() => {
    if (!noEventsDate) return;

    const touchStart = { x: 0 };

    const handleTouchStart = (e: TouchEvent) => {
      touchStart.x = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStart.x;
      
      if (Math.abs(deltaX) > 50) { // Minimum swipe distance
        if (deltaX > 0) {
          findPreviousEvent(noEventsDate);
        } else {
          findNextEvent(noEventsDate);
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [noEventsDate]);

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
          className="rounded-md border border-white/10 bg-black/50 backdrop-blur-md"
        />

        {noEventsDate && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-white/80 text-center"
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