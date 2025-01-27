import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, User, Phone } from "lucide-react";
import { pageTransition } from "@/lib/animations";
import { Event, ApiEvent } from "@/lib/types";
import { format } from "date-fns";

const EventDetails = () => {
  const { id } = useParams();
  console.log('Event ID:', id);

  const { data: event, isLoading, error } = useQuery<Event>({
    queryKey: ['event', id],
    queryFn: async () => {
      console.log('Fetching event details for ID:', id);
      const response = await fetch(`/api/salsas/${id}/`);
      console.log('Response:', response);
      if (!response.ok) {
        console.error('Error response:', response.statusText);
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Raw event data:', data);
      
      // Transform API data to match Event type
      const transformed = {
        id: data.id.toString(),
        title: data.name,
        description: data.details || '',
        date: new Date(data.event_date).toISOString(),
        time: data.time,
        venue: data.location.split(',')[0] || '',
        address: data.location,
        price: data.price || 'Free',
        imageUrl: data.image_url || '/default-event-image.jpg',
        organizerName: data.source || 'Unknown Organizer',
        organizerContact: '',
        createdAt: new Date(data.created_at || new Date()).toISOString(),
        updatedAt: new Date(data.updated_at || new Date()).toISOString(),
      };
      console.log('Transformed event:', transformed);
      return transformed;
    },
  });

  if (error) {
    console.error('Query error:', error);
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        Error loading event: {error.message}
      </div>
    );
  }

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

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto p-4 max-w-4xl"
    >
      <img
        src={event.imageUrl}
        alt={event.title}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />

      <div className="space-y-4 mb-6">
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-5 h-5" />
          <span>{format(new Date(event.date), "MMMM d, yyyy")}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-5 h-5" />
          <span>{event.time}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-5 h-5" />
          <div>
            <div>{event.venue}</div>
            <div className="text-sm">{event.address}</div>
          </div>
        </div>
      </div>

      <div className="prose max-w-none mb-8">
        <p>{event.description}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Organizer Information</h2>
        <div className="space-y-3 text-gray-600">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span>{event.organizerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            <span>{event.organizerContact}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventDetails;