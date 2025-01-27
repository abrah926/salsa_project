import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { Event } from "@/lib/types";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

const EventCard = ({ event, onClick }: EventCardProps) => {
  const date = new Date(event.date);

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      whileTap={{ scale: 0.98 }}
      className="p-3"
    >
      <Card 
        className="cursor-pointer overflow-hidden relative aspect-[4/3] rounded-2xl border border-white/10 shadow-lg w-full flex flex-col" 
        onClick={onClick}
      >
        {/* Top section with event details */}
        <div className="p-3 bg-black/95">
          <div className="flex justify-between items-start">
            <div className="text-white">
              <h3 className="text-sm font-medium mb-1 line-clamp-1">
                {event.title}
              </h3>
              <div className="text-xs font-medium tracking-wide">
                {format(date, 'EEE').toUpperCase()}
              </div>
              <div className="text-xl font-light -mt-1">
                {format(date, 'h:mm a')}
              </div>
            </div>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-md p-1.5 rounded-full hover:bg-white/20 transition-colors"
            >
              <MapPin className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>

        {/* Bottom section with image */}
        <div className="flex-1 relative">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
      </Card>
    </motion.div>
  );
};

export default EventCard;