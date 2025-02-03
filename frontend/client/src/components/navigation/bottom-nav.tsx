import { Home, Calendar, PlusCircle, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";
import eventDetailsIcon from "@/assets/event_details.png";

interface NavItem {
  icon: React.ComponentType<any> | (() => JSX.Element);
  path: string;
  label: string;
}

const BottomNav = () => {
  const [location, setLocation] = useLocation();

  // Get today's first event
  const getTodayEventPath = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayFormatted = new Date(today).toISOString().split('T')[0];
    return `/events/${todayFormatted}`;
  };

  const navItems = [
    { icon: Home, path: "/", label: "Home" },
    { icon: Calendar, path: "/calendar", label: "Calendar" },
    { 
      icon: () => (
        <img 
          src={eventDetailsIcon} 
          alt="Event Details"
          className="w-6 h-6"
        />
      ), 
      path: getTodayEventPath(),
      label: "Today's Event"
    },
    { icon: PlusCircle, path: "/create", label: "Create" },
    { icon: MessageCircle, path: "/contact", label: "Contact" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10">
      <div className="flex items-center justify-around px-6 py-2">
        {navItems.map(({ icon: Icon, path, label }) => (
          <button
            key={path}
            onClick={() => setLocation(path)}
            className={`p-3 rounded-full transition-colors ${
              location.startsWith(path.split('?')[0]) ? "bg-white/10" : "hover:bg-white/5"
            }`}
            aria-label={label}
          >
            {typeof Icon === 'function' && 'type' in Icon ? 
              <Icon className="w-6 h-6 text-white" /> : 
              <Icon />
            }
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
