import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, User, Phone } from "lucide-react";
import { pageTransition } from "@/components/animations";
import { type Event as SchemaEvent } from "@db/schema";
import { format } from "date-fns";
import { API_URL } from "@/config";
import { useState, useEffect, useRef } from "react";
import fetchEvents from "@/hooks/useEvents";

interface EventResponse {
  id: number;
  event_date: string;
  name: string;
  day: string;
  time: string;
  location: string;
  details: string;
  image_url: string;  // Backend field
}

interface Event {
  id: number;
  event_date: string;
  name: string;
  day: string;
  time: string;
  location: string;
  details: string;
  imageUrl: string;  // Frontend field
}

const EventDetails = () => {
  const params = useParams();
  const id = params?.id;
  const [, setLocation] = useLocation();
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: fetchEvents
  });

  // Get current event
  const currentEvent = events.find(e => e.id === Number(id));
  
  // Get all events sorted by date
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
  );

  // Get current date events
  const currentDateEvents = events.filter(event => 
    event.event_date === currentEvent?.event_date
  );

  // Get current index within same-day events
  const currentDateIndex = currentDateEvents.findIndex(e => e.id === Number(id));

  // Navigation functions
  const goToNextEvent = () => {
    if (currentDateIndex < currentDateEvents.length - 1) {
      // Next event on same date
      setLocation(`/events/${currentDateEvents[currentDateIndex + 1].id}`);
    }
  };

  const goToPreviousEvent = () => {
    if (currentDateIndex > 0) {
      // Previous event on same date
      setLocation(`/events/${currentDateEvents[currentDateIndex - 1].id}`);
    }
  };

  const goToNextDate = () => {
    if (!currentEvent) return;
    
    // Find next available event after current date
    const nextEvent = sortedEvents.find(event => 
      new Date(event.event_date) > new Date(currentEvent.event_date)
    );

    if (nextEvent) {
      setLocation(`/events/${nextEvent.id}`);
    }
  };

  const goToPreviousDate = () => {
    if (!currentEvent) return;
    
    // Find previous available event before current date
    const previousEvent = [...sortedEvents].reverse().find(event => 
      new Date(event.event_date) < new Date(currentEvent.event_date)
    );

    if (previousEvent) {
      setLocation(`/events/${previousEvent.id}`);
    }
  };

  // Handle touch events for swipe
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;
      
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;

      // Determine if horizontal or vertical swipe based on which delta is larger
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe - navigate between dates
        if (Math.abs(deltaX) > 50) {
          if (deltaX > 0) {
            goToPreviousDate();
          } else {
            goToNextDate();
          }
        }
      } else {
        // Vertical swipe - navigate between events on same date
        if (Math.abs(deltaY) > 50) {
          if (deltaY > 0) {
            goToPreviousEvent();
          } else {
            goToNextEvent();
          }
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentEvent, currentDateEvents, currentDateIndex]);

  const { data: event, isLoading } = useQuery<Event>({
    queryKey: ["event", id],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/events/${id}/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: EventResponse = await response.json();
      
      // Transform backend response to frontend format
      return {
        ...data,
        imageUrl: data.image_url  // Map backend field to frontend field
      };
    },
    enabled: !!id
  });

  console.log('Event from query:', event);
  console.log('Event fields:', {
    id: event?.id,
    event_date: event?.event_date,
    eventDate: event?.event_date,
    day: event?.day,
    time: event?.time
  });

  
  console.log('Raw event:', event);
  console.log('Event date field:', event?.event_date);
  console.log('Event day field:', event?.day);

  if (isLoading) {
    return (
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen"
      >
        <div className="space-y-4 text-center">
          <div className="h-96 bg-black/20 animate-pulse rounded-lg mb-4" />
          <div className="h-8 bg-black/20 animate-pulse rounded mb-4 w-3/4 mx-auto" />
          <div className="h-24 bg-black/20 animate-pulse rounded w-1/2 mx-auto" />
          <p className="text-white/60">Loading event details...</p>
        </div>
      </motion.div>
    );
  }

  if (!event) {
    return (
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="container mx-auto p-4 flex items-center justify-center min-h-screen"
      >
        <div className="text-center space-y-4">
          <p className="text-xl text-white/90">Event not found</p>
          <p className="text-sm text-white/60">
            The event you're looking for might have been removed or is no longer available.
          </p>
        </div>
      </motion.div>
    );
  }

  // Format the full date with timezone consideration
  const formattedDate = event?.event_date ? 
    format(
      // Set to noon in local timezone to avoid date shifting
      new Date(new Date(event.event_date).setHours(12, 0, 0, 0)), 
      'MMMM d, yyyy'
    ) : 
    'Date TBA';

  // Format time with timezone handling
  const formattedTime = event?.time ? 
    new Date(`2000-01-01T${event.time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }) : 
    'Time TBA';

  // Format the full date
  const eventDateValue = event?.event_date || event?.event_date;

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto p-4 max-w-4xl relative"
    >
      <AnimatePresence mode="sync">
        {!isLoading && event && (
          <motion.div
            key={event.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {event?.imageUrl && (
              <motion.img
                src={event.imageUrl}
                alt={event.name || ''}
                className="w-full h-64 object-cover rounded-lg mb-6"
                loading="eager"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}

            <div className="space-y-4 mb-6">
              <motion.h1 
                className="text-3xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {event.name}
              </motion.h1>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span>
                    {formattedDate}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>{formattedTime}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>{event.location}</span>
                </div>
              </motion.div>
            </div>

            <div className="prose max-w-none mb-8">
              <p>{event.details}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed position dots without animation */}
      <div className="absolute right-4 top-[65%] flex flex-col gap-2" style={{ transform: 'none' }}>
        {currentDateEvents.length > 1 && (
          <>
            <div
              className={`w-2 h-2 rounded-full transition-opacity ${
                currentDateIndex === 0 ? 'bg-white' : 'bg-white/30'
              }`}
            />
            <div
              className={`w-2 h-2 rounded-full transition-opacity ${
                currentDateIndex === 1 ? 'bg-white' : 'bg-white/30'
              }`}
            />
          </>
        )}
      </div>
    </motion.div>
  );
};

export default EventDetails;