import { useEffect, useState } from 'react';
import { api } from '../services/api';
import EventCard from './events/event-card';
import type { Event } from '@db/schema';

export function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      console.log('Starting to fetch events...');
      try {
        const data = await api.getEvents();
        console.log('Received events:', data);
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  console.log('Current events state:', events);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events && events.length > 0 ? (
        events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onClick={() => console.log('Event clicked:', event)}
          />
        ))
      ) : (
        <div>No events found</div>
      )}
    </div>
  );
} 