import { type Event } from "@db/schema";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

const EventCard = ({ event, onClick }: EventCardProps) => {
  // Format the date
  const formattedDate = event.event_date 
    ? format(new Date(event.event_date), 'MMMM d, yyyy')
    : 'Date TBA';

  // Format time from "20:00:00" to "8:00 PM"
  const formattedTime = event.time
    ? format(new Date(`2000-01-01T${event.time}`), 'h:mm a')
    : 'Time TBA';

  return (
    <div
      onClick={onClick}
      className="w-full aspect-[4/3] bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-6 cursor-pointer hover:scale-[1.02] transition-transform relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

      <div className="relative h-full flex flex-col justify-end">
        <h3 className="text-2xl font-bold text-white/90 mb-2">
          {event.name}
        </h3>
        
        <div className="space-y-1 text-white/60">
          <p>{formattedDate}</p>
          <p>{event.location}</p>
          <p>{formattedTime}</p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
