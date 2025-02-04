import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { pageTransition } from "@/components/animations";
import { useQuery } from "@tanstack/react-query";
import { type Event } from "@/types/event";
import fetchEvents from "@/hooks/useEvents";
import { useEffect } from "react";

const Home = () => {
  const [, setLocation] = useLocation();

  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  useEffect(() => {
    // Get today's date in 2025
    const today = new Date();
    today.setFullYear(2025);
    const todayStr = today.toISOString().split('T')[0];
    
    // Find first event on or after today
    const nextEvent = events.find(event => 
      event.event_date >= todayStr
    );

    if (nextEvent) {
      setLocation(`/events/${nextEvent.id}`);
    }
  }, [events, setLocation]);

  const handleEventClick = () => {
    const today = new Date().toISOString().split('T')[0];
    console.log('Today:', today); // Debug
    
    // Find first event for today or next available
    const todayEvent = events.find(event => 
      event.event_date && new Date(event.event_date).getTime() >= new Date(today).getTime()
    );

    console.log('Found event:', todayEvent); // Debug

    if (todayEvent) {
      console.log('Navigating to:', `/events/${todayEvent.id}`);
      setLocation(`/events/${todayEvent.id}`);
    } else {
      console.log('No events found, going to events page');
      setLocation("/events");
    }
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-black"
    >
      <div 
        className="min-h-screen bg-cover bg-center relative"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%), url('https://images.unsplash.com/photo-1504609813442-a8924e83f76e')`
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-center items-center p-8 text-center">
          <h1 className="text-[2.75rem] font-medium leading-tight mb-3 text-white/90">
            Salsa Dance Events
          </h1>
          <p className="text-xl font-light mb-8 text-white/80">
            Discover the rhythm of the Caribbean
          </p>
          <Button
            size="lg"
            onClick={handleEventClick}
            className="bg-white text-black hover:bg-white/90 text-base px-8 rounded-full"
          >
            Find Events
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;