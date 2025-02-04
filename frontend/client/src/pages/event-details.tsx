import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
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
  const id = params?.id;  // Get the id from params
  const [, setLocation] = useLocation();
  const today = new Date().toISOString().split('T')[0];
  const dateParam = new URLSearchParams(window.location.search).get('date') || today;

  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: fetchEvents
  });

  // Get events for the current date
  const currentDateEvents = events.filter(event => 
    event.event_date === dateParam
  );

  // Get index of current event in the filtered list
  const [currentIndex, setCurrentIndex] = useState(0);

  // Add touch ref
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Navigation functions
  const goToNextDate = () => {
    const nextEvent = events.find(event => 
      event.event_date && event.event_date > dateParam
    );
    if (nextEvent) {
      setLocation(`/events?date=${nextEvent.event_date}`);
    }
  };

  const goToPreviousDate = () => {
    const prevEvent = [...events].reverse().find(event => 
      event.event_date && event.event_date < dateParam
    );
    if (prevEvent) {
      setLocation(`/events?date=${prevEvent.event_date}`);
    }
  };

  const goToNextEvent = () => {
    if (currentIndex < currentDateEvents.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goToPreviousEvent = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
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

      // Determine if horizontal or vertical swipe
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 50) goToPreviousDate();
        else if (deltaX < -50) goToNextDate();
      } else {
        // Vertical swipe
        if (deltaY > 50) goToPreviousEvent();
        else if (deltaY < -50) goToNextEvent();
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentDateEvents, currentIndex]);

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

  // Add console logs to debug
  console.log('Raw event:', event);
  console.log('Event date field:', event?.event_date);
  console.log('Event day field:', event?.day);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="h-96 bg-gray-100 animate-pulse rounded-lg mb-4" />
        <div className="h-8 bg-gray-100 animate-pulse rounded mb-4" />
        <div className="h-24 bg-gray-100 animate-pulse rounded" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto p-4 text-center">
        Event not found
      </div>
    );
  }

  // Format time from "20:00:00" to "8:00 PM"
  const formattedTime = event?.time ? 
    format(new Date(`2000-01-01T${event.time}`), 'h:mm a') : 
    'Time TBA';

  // Format the full date
  const eventDateValue = event?.event_date || event?.event_date;

const formattedDate = eventDateValue
  ? format(new Date(eventDateValue), 'MMMM d, yyyy')
  : 'Date TBA';



  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto p-4 max-w-4xl"
    >
      {event?.imageUrl && (  // Change imageUrl to image_url to match backend
        <img
          src={event.imageUrl}
          alt={event.name || ''}  // Add fallback for null
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}

      <div className="space-y-4 mb-6">
        <h1 className="text-3xl font-bold mb-4">{event.name}</h1>

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

      </div>

      <div className="prose max-w-none mb-8">
        <p>{event.details}</p>
      </div>

      {/* Optional: Add visual indicators for available swipe directions */}
      {currentDateEvents.length > 1 && (
        <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {Array.from({ length: currentDateEvents.length }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default EventDetails;