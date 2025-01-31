import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { CalendarDropdown } from "@/components/events/calendar-dropdown";
import EventCard from "@/components/events/event-card";
import { pageTransition, staggerContainer } from "@/components/animations";
import { type Event } from "@db/schema";
import fetchEvents from "@/hooks/useEvents";

const Events = () => {
  const [, setLocation] = useLocation();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showCalendar, setShowCalendar] = useState(false);

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: fetchEvents,
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
      className="fixed inset-0 bg-black/95 flex flex-col overflow-hidden touch-none"
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
        <div className="flex-1 flex items-center">
          <div className="snap-x snap-mandatory scroll-smooth overflow-x-auto overflow-y-hidden flex w-full [scroll-snap-stop:always]">
            {sortedEvents.length === 0 ? (
              <div className="flex-shrink-0 w-full flex items-center justify-center py-12 text-white/60">
                No events found for the selected date
              </div>
            ) : (
              sortedEvents.map((event) => (
                <div key={event.id} className="flex-shrink-0 w-full flex items-center justify-center snap-center snap-always">
                  <div className="max-w-[65%] md:mx-auto mx-auto sm:-ml-[30px] transform -translate-x-10 sm:translate-x-0">
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
