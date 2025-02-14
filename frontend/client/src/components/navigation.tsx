import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useEvents } from '../hooks/useEvents';
import { useToast } from '@/hooks/use-toast';

const Navigation = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data, isLoading } = useEvents();

  const handleEventsClick = () => {
    if (isLoading) {
      toast({
        title: "Loading Events",
        description: "Please wait while events are loading...",
      });
      return;
    }
    setLocation('/events');
  };

  return (
    // ... rest of navigation code
    <button onClick={handleEventsClick}>
      {isLoading ? "Loading Events..." : "Events"}
    </button>
  );
};

export default Navigation; 