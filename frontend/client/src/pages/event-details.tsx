import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, Phone } from "lucide-react";
import { pageTransition } from "@/components/animations";
import { type Event } from "@/types/event";
import { formatInTimeZone } from "date-fns-tz";


import { API_URL } from "@/config";
import { useEffect, useRef } from "react";
import fetchEvents from "@/hooks/useEvents";

interface EventResponse {
  id: number;
  event_date: string;
  name: string;
  day: string;
  time: string;
  location: string;
  details: string;
  image_url: string; // Backend field
  imageUrl?: string; // Frontend field
  phone_number?: string; // Add phone number field
}

const EventDetails = () => {
  const params = useParams();
  const id = params?.id;
  const [, setLocation] = useLocation();
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => fetchEvents(),
    retry: 3,
    retryDelay: 5000,
    staleTime: 5 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });

  // Get current event
  const currentEvent = events.find((e) => e.id === Number(id));

  // Get all events sorted by date
  const sortedEvents = [...events].sort(
    (a, b) =>
      new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
  );

  // Get current date events
  const currentDateEvents = events.filter(
    (event) => event.event_date === currentEvent?.event_date
  );

  // Get current index within same-day events
  const currentDateIndex = currentDateEvents.findIndex(
    (e) => e.id === Number(id)
  );

  // Fetch event details
  const { data: event, isLoading: eventLoading } = useQuery<Event>({
    queryKey: ["event", id],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/events/${id}/`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        mode: "cors",
        credentials: "omit",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: EventResponse = await response.json();

      return {
        ...data,
        imageUrl: data.image_url,
        phone_number: data.phone_number
      };
    },
    enabled: !!id,
  });

  console.log("Event from query:", event);

  // **Fix Timezone Handling**
  const formattedDate = event?.event_date
    ? formatInTimeZone(event.event_date, "America/Puerto_Rico", "MMMM d, yyyy") // Use the imported function directly
    : "Date TBA";

  const formattedTime = event?.time
    ? new Date(`2000-01-01T${event.time}`).toLocaleTimeString("en-US", {
        timeZone: "America/Puerto_Rico",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "Time TBA";

  const handleLocationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (event?.location) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  // Add these navigation functions
  const goToNextEvent = () => {
    if (currentDateIndex < currentDateEvents.length - 1) {
      setLocation(`/events/${currentDateEvents[currentDateIndex + 1].id}`);
    }
  };

  const goToPreviousEvent = () => {
    if (currentDateIndex > 0) {
      setLocation(`/events/${currentDateEvents[currentDateIndex - 1].id}`);
    }
  };

  const goToNextDate = () => {
    if (!currentEvent) return;
    const nextEvent = sortedEvents.find(event => 
      new Date(event.event_date) > new Date(currentEvent.event_date)
    );
    if (nextEvent) {
      setLocation(`/events/${nextEvent.id}`);
    }
  };

  const goToPreviousDate = () => {
    if (!currentEvent) return;
    const previousEvent = [...sortedEvents].reverse().find(event => 
      new Date(event.event_date) < new Date(currentEvent.event_date)
    );
    if (previousEvent) {
      setLocation(`/events/${previousEvent.id}`);
    }
  };

  // Replace the touch handlers with useEffect
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

      const SWIPE_THRESHOLD = 50;

      // Determine if horizontal or vertical swipe based on which delta is larger
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe - navigate between dates
        if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
          if (deltaX > 0) {
            goToPreviousDate();
          } else {
            goToNextDate();
          }
        }
      } else {
        // Vertical swipe - navigate between events on same date
        if (Math.abs(deltaY) > SWIPE_THRESHOLD) {
          if (deltaY > 0) {
            goToPreviousEvent();
          } else {
            goToNextEvent();
          }
        }
      }

      touchStart.current = null;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentEvent, currentDateEvents, currentDateIndex]);

  const formatDay = (dateString: string | null) => {
    if (!dateString) return null;
    return formatInTimeZone(
      dateString,
      'America/Puerto_Rico',
      'EEEE' // 'EEEE' gives us the full day name
    );
  };

  if (isLoading || eventLoading) {
    return (
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center"
      >
        <div className="space-y-4 text-center p-4">
          <div className="w-16 h-16 border-t-2 border-white/90 rounded-full animate-spin mx-auto" />
          <p className="text-white/80">Loading event details...</p>
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
            The event you're looking for might have been removed or is no longer
            available.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 bg-black/95 overflow-y-auto"
    >
      <AnimatePresence mode="sync">
        {!eventLoading && event && (
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
                alt={event.name || ""}
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
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <div className="flex flex-col">
                    <span>{formattedDate}</span>
                    {event.event_date && (
                      <span className="text-sm text-gray-500">
                        {formatDay(event.event_date)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span>{formattedTime}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location || '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 hover:text-gray-90 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span>{event.location}</span>
                  </a>
                </div>

                {event.phone_number && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <a 
                      href={`tel:${event.phone_number}`}
                      className="flex items-center gap-2 hover:text-gray-90 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span>{event.phone_number}</span>
                    </a>
                  </div>
                )}
              </motion.div>
            </div>

            <div className="prose max-w-none mb-8">
              <p>{event.details}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add back the dots indicator */}
      {currentDateEvents.length > 1 && (
        <div className="fixed right-4 top-[60%] flex flex-col gap-2">
          {currentDateEvents.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-opacity ${
                currentDateIndex === index ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default EventDetails;
