import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, User, Phone } from "lucide-react";
import { pageTransition } from "@/components/animations";
import { type Event as SchemaEvent } from "@db/schema";
import { format } from "date-fns";
import { API_URL } from "@/config";

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
  const { id } = useParams();

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
    </motion.div>
  );
};

export default EventDetails;