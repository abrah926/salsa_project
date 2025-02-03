import { useState, useEffect } from "react";
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
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false
  });

  const [visibleCount, setVisibleCount] = useState(10);
  
  // Just use events directly, no need for flatMap
  const allEvents = events ?? [];
  const visibleEvents = allEvents.slice(0, visibleCount);

  // Load more when reaching the end
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (visibleCount < allEvents.length) {
            setVisibleCount(prev => prev + 10);
          } else if (isLoading) {
            // Add void to handle the Promise
            void fetchEvents();
          }
        }
      },
      { threshold: 0.5 }
    );

    // Add event-card class to fix querySelector error
    const lastCard = document.querySelector('div[class*="flex-shrink-0"]:last-child');
    if (lastCard) observer.observe(lastCard);

    return () => observer.disconnect();
  }, [visibleCount, allEvents.length, isLoading, fetchEvents]);

  // Get filtered events based on selected date
  const getFilteredAndSortedEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // First, sort all events by date
    const allSortedEvents = [...events].sort((a, b) => {
      if (!a.event_date || !b.event_date) return 0;
      return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
    });

    if (selectedDate) {
      // Get events for selected date
      const selectedEvents = allSortedEvents.filter(event => 
        event.event_date && new Date(event.event_date).toDateString() === selectedDate.toDateString()
      );

      // If no events on selected date, find next available event
      if (selectedEvents.length === 0) {
        const nextEvents = allSortedEvents.filter(event => {
          if (!event.event_date) return false;
          const eventDate = new Date(event.event_date);
          return eventDate >= selectedDate;
        });
        return nextEvents.length > 0 ? nextEvents : allSortedEvents;
      }

      return selectedEvents;
    }

    // If no date selected, return all future events
    return allSortedEvents.filter(event => {
      if (!event.event_date) return false;
      const eventDate = new Date(event.event_date);
      return eventDate >= today;
    });
  };

  const sortedEvents = getFilteredAndSortedEvents();

  // Scroll to first event when date changes
  useEffect(() => {
    if (selectedDate && sortedEvents.length > 0) {
      const firstEventCard = document.querySelector('.snap-center');
      if (firstEventCard) {
        firstEventCard.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [selectedDate, sortedEvents.length]);

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
                No events found for the selected date. Scroll to see next available events.
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
