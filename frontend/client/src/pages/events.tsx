import { useState, useEffect, useRef, useCallback, Key } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { CalendarDropdown } from "@/components/events/calendar-dropdown";
import EventCard from "@/components/events/event-card";
import { pageTransition, staggerContainer } from "@/components/animations";
import { type Event } from '@/types/event';
import { useEvents } from "@/hooks/useEvents";
import { useWindowVirtualizer } from '@tanstack/react-virtual';

const EVENTS_PER_PAGE = 50;

const Events = () => {
  const [, setLocation] = useLocation();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showCalendar, setShowCalendar] = useState(false);
  const [displayedEvents, setDisplayedEvents] = useState<Event[]>([]);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const loadMoreRef = useRef(null);

  const { data: events = [], isLoading } = useEvents();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setIsIntersecting(entries[0]?.isIntersecting ?? false);
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isIntersecting && events.length > displayedEvents.length) {
      setDisplayedEvents(prev => [
        ...prev,
        ...events.slice(prev.length, prev.length + EVENTS_PER_PAGE)
      ]);
    }
  }, [isIntersecting, events]);

  // Get filtered events based on selected date
  const getFilteredAndSortedEvents = () => {
    // We removed all the date filtering logic which might be needed
    // Add back date filtering but keep pagination
    const allSortedEvents = [...events].sort((a, b) => {
      if (!a.event_date || !b.event_date) return 0;
      return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
    });

    // First get all valid future events
    const futureEvents = allSortedEvents.filter(event => {
      if (!event.event_date) return false;
      const eventDate = new Date(event.event_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate >= today;
    });

    return futureEvents.slice(0, EVENTS_PER_PAGE);
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

  const parentRef = useRef<HTMLDivElement>(null);
  const parentOffsetRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useWindowVirtualizer({
    count: events.length,
    estimateSize: useCallback(() => 500, []),
    overscan: 5
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
          <div ref={parentRef} className="h-screen overflow-auto">
            <div
              ref={parentOffsetRef}
              style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualItem: { key: Key | null | undefined; size: any; start: any; index: string | number; }) => (
                <div
                  key={virtualItem.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <EventCard
                    event={events[virtualItem.index as number]}
                    onClick={() => setLocation(`/events/${events[virtualItem.index as number].id}`)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div ref={loadMoreRef} />
        </div>
      )}
    </motion.div>
  );
};

export default Events;
