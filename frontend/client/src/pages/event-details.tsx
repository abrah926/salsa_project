import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, User, Phone } from "lucide-react";
import { pageTransition } from "@/lib/animations";
import { type Event } from "@db/schema";
import { format } from "date-fns";

const EventDetails = () => {
  const { id } = useParams();

  const { data: event, isLoading } = useQuery<Event>({
    queryKey: [`/api/events/${id}`],
  });

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
        alt={event.name}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />

      <div className="space-y-4 mb-6">
        <h1 className="text-3xl font-bold mb-4">{event.name}</h1>

        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-5 h-5" />
          <span>
            {event.eventDate ? format(new Date(event.eventDate), "MMMM d, yyyy") : "Date TBA"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-5 h-5" />
          <span>{event.time}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-5 h-5" />
          <div>
            <div>{event.location}</div>
            <div className="text-sm">{event.location}</div>
          </div>
        </div>
      </div>

      <div className="prose max-w-none mb-8">
        <p>{event.details}</p>
      </div>
    </motion.div>
  );
};

export default EventDetails;