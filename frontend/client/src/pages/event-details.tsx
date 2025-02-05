import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
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
        imageUrl: data.image_url, // Map backend field to frontend field
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
      className="container mx-auto p-4 max-w-4xl relative"
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
                  <Calendar className="w-5 h-5" />
                  <span>{formattedDate}</span>
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
    </motion.div>
  );
};

export default EventDetails;
