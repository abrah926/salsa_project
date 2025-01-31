import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn } from "@/components/animations";
import { type Event } from "@db/schema";
import { format, isDate } from "date-fns";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

const EventCard = ({ event, onClick }: EventCardProps) => {
  console.log('Raw event:', event);  // Log the raw event
  const date = event.event_date ? new Date(event.event_date) : null;
  console.log('Parsed date:', date);  // Log the parsed date
  const isValidDate = date && !isNaN(date.getTime());
  console.log('Is valid date:', isValidDate);  // Log if date is valid

  // Format time from "20:00:00" to "8:00 PM"
  const formattedTime = event.time ? 
    format(new Date(`2000-01-01T${event.time}`), 'h:mm a') : 
    'Time TBA';

  // Add date formatting
  const formattedDate = event.event_date ? 
    format(new Date(event.event_date), 'MMM d, yyyy') : 
    'Date TBA';

  // Default image URL for when event.image_url is null or empty
  const defaultImageUrl = "https://w0.peakpx.com/wallpaper/1021/361/HD-wallpaper-tango-music-entertainment-passion-dance-couplemen-couple-women.jpg";

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      whileTap={{ scale: 0.98 }}
      className="p-3"
    >
      <Card 
        className="cursor-pointer overflow-hidden relative h-[500px] rounded-2xl border border-white/10 shadow-lg w-[300px] mx-2 flex flex-col" 
        onClick={onClick}
      >
        {/* Top section with event details */}
        <div className="p-4 bg-black/95 h-[150px]">
          <div className="flex justify-between items-start">
            <div className="text-white">
              <h3 className="text-lg font-medium mb-2 line-clamp-1">
                {event.name}
              </h3>
              <div className="text-sm font-medium tracking-wide mb-1.5">
                {event.day || 'Day TBA'}
              </div>
              <div className="text-2xl font-light">
                {formattedTime}
              </div>
            </div>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-md p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <MapPin className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>

        {/* Bottom section with image */}
        <div className="flex-1 relative">
          <img
            src={event.imageUrl || defaultImageUrl}
            alt={event.name || 'Event'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
      </Card>
    </motion.div>
  );
};

export default EventCard;
