import { Home, Calendar, PlusCircle, MessageCircle, LucideIcon } from "lucide-react";
import { useLocation, Link } from "wouter";
import eventDetailsIcon from "@/assets/event_details.png";
import { useQuery } from "@tanstack/react-query";
import fetchEvents from "@/hooks/useEvents";
import { type Event } from "@db/schema";

interface NavLink {
  href: string;
  icon: typeof Home | (() => JSX.Element);
  label: string;
}

const BottomNav = () => {
  const [location, setLocation] = useLocation();
  
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: fetchEvents
  });

  const getTodayEventPath = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayEvent = events.find(event => 
      typeof event.event_date === 'string' && event.event_date === today
    );
    return todayEvent ? `/events/${todayEvent.id}` : '/events';
  };

  const links: NavLink[] = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/calendar", icon: Calendar, label: "Calendar" },
    { 
      href: getTodayEventPath(),
      icon: () => (
        <img 
          src={eventDetailsIcon} 
          alt="Details"
          className="w-6 h-6"
        />
      ),
      label: "Details"
    },
    { href: "/create", icon: PlusCircle, label: "Create" },
    { href: "/contact", icon: MessageCircle, label: "Contact" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 max-w-screen-lg mx-auto safe-area-bottom rounded-t-xl">
      <div className="flex justify-around items-center h-[4.5rem] px-2">
        {links.map(({ href, icon: Icon, label }) => {
          const isActive = location === href;
          return (
            <Link key={href} href={href}>
              <a className="flex flex-col items-center justify-center w-full min-w-[3rem] py-1 px-2 touch-manipulation">
                <div className="h-6 mb-1">
                  {typeof Icon === 'function' && 'type' in Icon ? (
                    <Icon 
                      size={24}
                      className={isActive ? "text-black font-bold" : "text-black"}
                    />
                  ) : (
                    <Icon />
                  )}
                </div>
                <span
                  className={`text-[0.625rem] leading-tight font-medium ${
                    isActive ? "text-black font-bold" : "text-black"
                  }`}
                >
                  {label}
                </span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
