import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { CalendarDropdown } from "@/components/events/calendar-dropdown";
import EventCard from "@/components/events/event-card";
import { pageTransition, staggerContainer } from "@/lib/animations";
import { Event, ApiEvent } from "@/lib/types";

const Events = () => {
  const [, setLocation] = useLocation();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showCalendar, setShowCalendar] = useState(false);

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async (): Promise<Event[]> => {
      console.log('Fetching events...');
      const response = await fetch('/api/salsas/');
      console.log('API Response:', response);
      if (!response.ok) {
        console.error('Error response:', response.statusText);
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Raw API data:', data);
      const transformedData = data.map((event: ApiEvent) => ({
        id: event.id.toString(),
        title: event.name,
        description: event.details || '',
        date: new Date(event.event_date).toISOString(),
        time: event.time,
        venue: event.location.split(',')[0] || '',
        address: event.location,
        price: event.price || 'Free',
        imageUrl: event.image_url || '/default-event-image.jpg',
        organizerName: event.source || 'Unknown Organizer',
        organizerContact: '',
        createdAt: new Date(event.created_at || new Date()).toISOString(),
        updatedAt: new Date(event.updated_at || new Date()).toISOString(),
      }));
      console.log('Transformed events:', transformedData);
      return transformedData;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  console.log('Current events:', events);

  const filteredEvents = selectedDate
    ? events.filter(event => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear()
        );
      })
    : events;

  // Sort events by date and time
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
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
          <span className="text-lg font-medium text-white/90">Events</span>
        </div>
      </div>

      {isLoading ? (
        <div className="p-6">
          <div className="w-[65%] mx-auto aspect-[4/3] bg-gray-800/50 animate-pulse rounded-3xl" />
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
                <div key={event.id} className="flex-shrink-0 w-full snap-center">
                  <div className="max-w-[65%] mx-auto">
                    <EventCard
                      event={event}
                      onClick={() => {
                        console.log('Navigating to:', `/events/${event.id}`);
                        setLocation(`/events/${event.id}`);
                      }}
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