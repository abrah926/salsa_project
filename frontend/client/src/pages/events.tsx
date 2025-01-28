import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { CalendarDropdown } from "@/components/events/calendar-dropdown";
import EventCard from "@/components/events/event-card";
import { pageTransition, staggerContainer } from "@/lib/animations";
import { type Event } from "@db/schema";

const Events = () => {
  const [, setLocation] = useLocation();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showCalendar, setShowCalendar] = useState(false);

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });

  const filteredEvents = selectedDate
    ? events.filter(event => event.event_date && new Date(event.event_date).toDateString() === selectedDate.toDateString())
    : events;

  // Sort events by date and time
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (!a.event_date || !b.event_date) return 0;
    return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
  });

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-black/95 flex flex-col"
    >
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-4">
          <CalendarDropdown
            date={selectedDate}
            showCalendar={showCalendar}
            onShow={setShowCalendar}
            onSelect={(date) => {
              setSelectedDate(date);
              setShowCalendar(false);
            }}
          />
          <span className="absolute left-1/2 -translate-x-1/2 text-xl font-medium text-white/90">Events</span>
          <div className="w-12 opacity-0">
            {/* Empty div to maintain spacing */}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="p-6">
          <div className="w-[90%] md:w-[65%] mx-auto aspect-[4/3] bg-gray-800/50 animate-pulse rounded-3xl" />
        </div>
      ) : (
        <div className="flex-1 flex items-end pb-[calc(1rem+60px)]">
          <div className="snap-x snap-mandatory overflow-x-auto flex w-full scrollbar-hide">
            {sortedEvents.length === 0 ? (
              <div className="flex-shrink-0 w-full flex items-center justify-center py-12 text-white/60">
                No events found for the selected date
              </div>
            ) : (
              sortedEvents.map((event) => (
                <div key={event.id} className="flex-shrink-0 w-full min-h-screen md:min-h-0 flex items-center justify-center snap-center">
                  <div className="max-w-[65%] h-[80vh] md:h-auto mx-auto">
                    <EventCard
                      event={event}
                      onClick={() => setLocation(`/events/${event.id}`)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Events;