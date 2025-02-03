import { Home, Calendar, PlusCircle, MessageCircle, ListMusic } from "lucide-react";
import { useLocation } from "wouter";

const BottomNav = () => {
  const [location, setLocation] = useLocation();

  // Get today's first event
  const getTodayEventPath = () => {
    const today = new Date().toISOString().split('T')[0];
    return `/events?date=${today}`;  // We'll handle this in event-details page
  };

  const navItems = [
    { icon: Home, path: "/" },
    { icon: Calendar, path: "/calendar" },
    { icon: PlusCircle, path: "/create" },
    { icon: MessageCircle, path: "/contact" },
    { icon: ListMusic, path: getTodayEventPath() },  // Dynamic path based on date
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10">
      <div className="flex items-center justify-around px-6 py-2">
        {navItems.map(({ icon: Icon, path }) => (
          <button
            key={path}
            onClick={() => setLocation(path)}
            className={`p-3 rounded-full transition-colors ${
              location.startsWith(path.split('?')[0]) ? "bg-white/10" : "hover:bg-white/5"
            }`}
          >
            <Icon className="w-6 h-6 text-white" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
