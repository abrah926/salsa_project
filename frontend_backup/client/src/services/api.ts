import type { Event } from '../lib/types';

const API_URL = import.meta.env.VITE_API_URL;

export interface ApiEvent {
  id: number;
  event_date: string;
  day: string;
  time: string;
  name: string;
  location: string;
  source: string;
  price: string;
  details: string;
  recurrence: string;
  recurrence_interval: string;
  end_date: string;
  end_recurring_date: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

// Add this function to transform API data to your frontend format
const transformEvent = (apiEvent: ApiEvent): Event => {
  console.log('Transforming event:', apiEvent);
  const transformed = {
    id: apiEvent.id.toString(),
    title: apiEvent.name,
    description: apiEvent.details || '',
    date: new Date(apiEvent.event_date).toISOString(),
    time: apiEvent.time,
    venue: apiEvent.location.split(',')[0] || '',
    address: apiEvent.location,
    price: apiEvent.price,
    imageUrl: apiEvent.image_url,
    organizerName: apiEvent.source || 'Unknown Organizer',
    organizerContact: '',
    createdAt: new Date(apiEvent.created_at).toISOString(),
    updatedAt: new Date(apiEvent.updated_at).toISOString(),
  };
  console.log('Transformed to:', transformed);
  return transformed;
};

export const api = {
  // Get all events
  getEvents: async (): Promise<Event[]> => {
    try {
      console.log('Fetching events...');
      const response = await fetch('/api/salsas/');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        console.error('Response not OK:', response.statusText);
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      console.log('Raw API data:', data);
      
      if (!Array.isArray(data)) {
        console.error('Data is not an array:', data);
        return [];
      }
      
      const transformedData = data.map((event: ApiEvent) => {
        console.log('Processing event:', event);
        return {
          id: event.id.toString(),
          title: event.name,
          description: event.details || '',
          date: new Date(event.event_date).toISOString(),
          time: event.time,
          venue: event.location.split(',')[0] || '',
          address: event.location,
          price: event.price,
          imageUrl: event.image_url || '/default-event-image.jpg',
          organizerName: event.source || 'Unknown Organizer',
          organizerContact: '',
          createdAt: new Date(event.created_at || new Date()).toISOString(),
          updatedAt: new Date(event.updated_at || new Date()).toISOString(),
        };
      });
      
      console.log('Transformed data:', transformedData);
      return transformedData;
    } catch (error) {
      console.error('Error in getEvents:', error);
      throw error;
    }
  },

  // Get calendar events
  getCalendarEvents: async () => {
    const response = await fetch('/api/calendar/');
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  // Create new event
  createEvent: async (eventData: any) => {
    const response = await fetch('/api/salsas/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  // Update event
  updateEvent: async (id: string, eventData: any) => {
    const response = await fetch(`/api/salsas/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  // Delete event
  deleteEvent: async (id: string) => {
    const response = await fetch(`/api/salsas/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return true;
  }
}; 