import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useEvents } from '../hooks/useEvents';
import { useToast } from '@/hooks/use-toast';

const Navigation = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data, isLoading } = useEvents();

  const handleEventsClick = () => {
    // Navigate immediately, no loading check
    setLocation('/events');
  };

  return (
    // ... rest of navigation code
    <button onClick={handleEventsClick}>
      Events
    </button>
  );
};

export default Navigation; 