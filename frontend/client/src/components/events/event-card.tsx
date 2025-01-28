import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { type Event } from "@db/schema";
import { format, isDate } from "date-fns";

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

const EventCard = ({ event, onClick }: EventCardProps) => {
  const date = event.eventDate ? new Date(event.eventDate) : null;
  const isValidDate = date && !isNaN(date.getTime());

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      whileTap={{ scale: 0.98 }}
      className="-mt-6 p-3"
    >
      <Card 
        className="cursor-pointer overflow-hidden relative h-[750px] rounded-2xl border border-white/10 shadow-lg w-[calc(100%+60px)] -ml-[30px] flex flex-col" 
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
                {isValidDate ? format(date, 'EEE').toUpperCase() : 'Date TBA'}
              </div>
              <div className="text-2xl font-light">
                {isValidDate ? format(date, 'h:mm a') : 'Time TBA'}
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
            src={event.imageUrl || ''}
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