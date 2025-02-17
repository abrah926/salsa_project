import { Home, Calendar, PlusCircle, MessageCircle } from "lucide-react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import fetchEvents from "@/hooks/useEvents";
import { type Event } from "@/types/event";
import threeLinesIcon from "@/assets/3lines.png";

interface NavLink {
  href: string;
  icon: typeof Home | typeof Calendar | typeof PlusCircle | typeof MessageCircle | typeof ThreeLinesIcon;
  label: string;
  customIcon?: boolean;
  onClick?: () => void;
}

const ThreeLinesIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    className={className}
  >
    <line x1="3" y1="6" x2="21" y2="6" strokeWidth="1.5" />
    <line x1="3" y1="12" x2="21" y2="12" strokeWidth="1.5" />
    <line x1="3" y1="18" x2="21" y2="18" strokeWidth="1.5" />
  </svg>
);

const BottomNav = () => {
  const [location, setLocation] = useLocation();
  
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: () => fetchEvents(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  });

  const handleEventsClick = () => {
    const today = new Date().toISOString().split('T')[0];
    
    const todayEvent = events.find(event => 
      event.event_date && new Date(event.event_date).getTime() >= new Date(today).getTime()
    );

    if (todayEvent) {
      setLocation(`/events/${todayEvent.id}`);
    } else {
      // Stay on current page if no events found
      console.log('No upcoming events found');
    }
  };

  const links: NavLink[] = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/calendar", icon: Calendar, label: "Calendar" },
    { 
      href: "#", // Changed to # to prevent default navigation
      icon: ThreeLinesIcon,
      label: "Events",
      onClick: handleEventsClick // Add onClick handler
    },
    { href: "/create", icon: PlusCircle, label: "Create" },
    { href: "/contact", icon: MessageCircle, label: "Contact" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md 
      border-t border-red-800/30 
      shadow-[0_-4px_6px_-1px_rgba(220,38,38,0.1)] 
      z-50 max-w-screen-lg mx-auto safe-area-bottom rounded-t-2xl"
    >
      <div className="flex justify-around items-center h-[4.5rem] px-2">
        {links.map(({ href, icon: Icon, label, onClick }) => {
          const isActive = location === href;
          return (
            <Link key={href} href={href}>
              <a 
                className="flex flex-col items-center justify-center w-full min-w-[3rem] py-1 px-2 touch-manipulation"
                onClick={(e) => {
                  if (onClick) {
                    e.preventDefault();
                    onClick();
                  }
                }}
              >
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
