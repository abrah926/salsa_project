import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";
import { pageTransition } from "@/components/animations";
import fetchEvents from "@/hooks/useEvents";
import { type Event } from "@/types/event";
import { format } from "date-fns";

const CalendarPage = () => {
  const [, setLocation] = useLocation();
  const [noEventsDate, setNoEventsDate] = useState<Date | null>(null);
  
  // Set default date to current month
  const currentDate = new Date();
  currentDate.setFullYear(2025); // Keep the year 2025
  const [selectedMonth, setSelectedMonth] = useState<Date>(currentDate);

  const { data: events = [], isError, error, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => fetchEvents(),
    retry: 3,
    retryDelay: 5000,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 24 * 60 * 60 * 1000, // Keep in garbage collection for 24 hours (renamed from cacheTime)
  });

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const dateString = date.toISOString().split('T')[0];
    
    // Find events on the selected date without timezone issues
    const eventsOnDate = events.filter(event => {
      if (!event.event_date) return false;
      const eventDateString = new Date(event.event_date).toISOString().split('T')[0];
      return eventDateString === dateString;
    });
    
    console.log('Found events for selected date:', eventsOnDate);
    
    if (eventsOnDate.length > 0) {
      setLocation(`/events/${eventsOnDate[0].id}`);
    } else {
      setNoEventsDate(date);
    }
  };

  // Update findNextEvent function
  const findNextEvent = (fromDate: Date) => {
    const dateString = fromDate.toISOString().split('T')[0];
    console.log('Finding next event after:', dateString);
    
    const nextEvent = events
      .filter(event => {
        if (!event.event_date) return false;
        return event.event_date > dateString;
      })
      .sort((a, b) => 
        a.event_date!.localeCompare(b.event_date!)
      )[0];

    console.log('Next event found:', nextEvent);

    if (nextEvent) {
      setLocation(`/events/${nextEvent.id}`);
      setNoEventsDate(null);
    }
  };

  // Update findPreviousEvent function
  const findPreviousEvent = (fromDate: Date) => {
    const dateString = fromDate.toISOString().split('T')[0];
    console.log('Finding previous event before:', dateString);
    
    const prevEvent = events
      .filter(event => {
        if (!event.event_date) return false;
        return event.event_date < dateString;
      })
      .sort((a, b) => 
        b.event_date!.localeCompare(a.event_date!)
      )[0];

    console.log('Previous event found:', prevEvent);

    if (prevEvent) {
      setLocation(`/events/${prevEvent.id}`);
      setNoEventsDate(null);
    }
  };

  // Add loading UI
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center p-4">
        <p className="text-white/80 mb-4">Loading events...</p>
      </div>
    );
  }

  // Add error UI
  if (isError) {
    return (
      <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">Error loading events</p>
        <p className="text-sm text-gray-400">
          {error instanceof Error ? error.message : 'Please try again later'}
        </p>
      </div>
    );
  }

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
          defaultMonth={selectedMonth}
          selected={noEventsDate || undefined}
          className="rounded-md border border-white/10 bg-black/50 backdrop-blur-md p-4 scale-125"
        />

        {noEventsDate && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-white/80 text-center"
          >
            <p>No events available on {format(noEventsDate, 'MMMM d, yyyy')}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CalendarPage;