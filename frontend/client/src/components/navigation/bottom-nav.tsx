import { Home, Calendar, PlusCircle, MessageCircle } from "lucide-react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import fetchEvents from "@/hooks/useEvents";
import { type Event } from "@/types/event";
import threeLinesIcon from "@/assets/3lines.png";

interface NavLink {
  href: string;
  icon: typeof Home | (() => JSX.Element);
  label: string;
}

const ThreeLinesIcon = () => (
  <img 
    src={threeLinesIcon} 
    alt="Events" 
    className="w-6 h-6"
  />
);

const BottomNav = () => {
  const [location, setLocation] = useLocation();
  
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: () => fetchEvents(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  });

  const getTodayEventPath = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayEvent = events.find(event => 
      typeof event.event_date === 'string' && event.event_date === today
    );
    return todayEvent ? `/events/${todayEvent.id}` : null;
  };

  const links: NavLink[] = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/calendar", icon: Calendar, label: "Calendar" },
    { 
      href: getTodayEventPath() || "#",
      icon: ThreeLinesIcon,
      label: "Events"
    },
    { href: "/create", icon: PlusCircle, label: "Create" },
    { href: "/contact", icon: MessageCircle, label: "Contact" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10 z-50 max-w-screen-lg mx-auto safe-area-bottom rounded-t-2xl">
      <div className="flex justify-around items-center h-[4.5rem] px-2">
        {links.map(({ href, icon: Icon, label }) => {
          const isActive = location === href;
          return (
            <Link key={href} href={href}>
              <a className="flex flex-col items-center justify-center w-full min-w-[3rem] py-1 px-2 touch-manipulation">
                <div className="h-6 mb-1">
                  <Icon 
                    size={24}
                    strokeWidth={1.5}
                    className={`transition-opacity ${
                      isActive ? "text-white opacity-100" : "text-white opacity-60"
                    }`}
                  />
                </div>
                <span
                  className={`text-[0.625rem] leading-tight font-medium transition-opacity ${
                    isActive ? "text-white opacity-100" : "text-white opacity-60"
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
