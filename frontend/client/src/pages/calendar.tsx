import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";
import { pageTransition } from "@/components/animations";
import fetchEvents from "@/hooks/useEvents";
import { type Event } from "@db/schema";

const CalendarPage = () => {
  const [, setLocation] = useLocation();
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: fetchEvents
  });

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;

    const selectedDate = date.toISOString().split('T')[0];
    
    // Find first event on selected date or next available
    const selectedEvent = events.find(event => 
      event.event_date && new Date(event.event_date).getTime() >= new Date(selectedDate).getTime()
    );

    if (selectedEvent) {
      setLocation(`/events/${selectedEvent.id}`);
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

      <div className="flex-1 flex items-center justify-center p-4">
        <Calendar
          mode="single"
          onSelect={handleSelect}
          className="rounded-md border border-white/10 bg-black/50 backdrop-blur-md"
        />
      </div>
    </motion.div>
  );
};

export default CalendarPage; 