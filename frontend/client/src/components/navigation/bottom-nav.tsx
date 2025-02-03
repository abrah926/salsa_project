import { Home, Calendar, PlusCircle, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";
import eventDetailsIcon from "@/assets/event_details.png";
import { useQuery } from "@tanstack/react-query";
import fetchEvents from "@/hooks/useEvents";
import { API_URL } from "@/config";
import { type Event } from "@db/schema";

interface NavItem {
  icon: React.ComponentType<any> | (() => JSX.Element);
  path: string;
  label: string;
}

const BottomNav = () => {
  const [location, setLocation] = useLocation();
  
  // Use our existing query hook
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: fetchEvents
  });

  // Get today's first event path
  const getTodayEventPath = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayEvent = events.find(event => 
      typeof event.event_date === 'string' && event.event_date === today
    );
    return todayEvent ? `/events/${todayEvent.id}` : '/events';
  };

  const navItems = [
    { icon: Home, path: "/", label: "Home" },
    { icon: Calendar, path: "/calendar", label: "Calendar" },
    { 
      icon: () => (
        <img 
          src={eventDetailsIcon} 
          alt="Event Details"
          className="w-6 h-6 invert" // Invert to make icon white
        />
      ), 
      path: getTodayEventPath(),
      label: "Today's Event"
    },
    { icon: PlusCircle, path: "/create", label: "Create" },
    { icon: MessageCircle, path: "/contact", label: "Contact" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="flex items-center justify-around px-6 py-2">
        {navItems.map(({ icon: Icon, path, label }) => (
          <button
            key={path}
            onClick={() => setLocation(path)}
            className={`p-3 rounded-full transition-colors ${
              location.startsWith(path.split('?')[0]) 
                ? "bg-black/10" 
                : "hover:bg-black/5"
            }`}
            aria-label={label}
          >
            {typeof Icon === 'function' && 'type' in Icon ? 
              <Icon className="w-6 h-6 text-black" /> : 
              <Icon />
            }
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
