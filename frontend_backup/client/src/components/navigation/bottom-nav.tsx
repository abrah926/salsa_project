import { Home, Calendar, PlusCircle, MessageCircle } from "lucide-react";
import { useLocation, Link } from "wouter";

const BottomNav = () => {
  const [location] = useLocation();

  const links = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/events", icon: Calendar, label: "Events" },
    { href: "/create", icon: PlusCircle, label: "Create" },
    { href: "/contact", icon: MessageCircle, label: "Contact" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        {links.map(({ href, icon: Icon, label }) => {
          const isActive = location === href;
          return (
            <Link key={href} href={href}>
              <a className="flex flex-col items-center gap-1">
                <Icon
                  className={`w-6 h-6 ${
                    isActive ? "text-primary" : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-xs ${
                    isActive ? "text-primary" : "text-gray-500"
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
