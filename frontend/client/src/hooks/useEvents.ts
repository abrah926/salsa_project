import { API_URL } from '@/config';
import { Event } from '@/types/event';

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;

const fetchEvents = async (): Promise<Event[]> => {
  try {
    console.log('Fetching from:', `${API_URL}/api/events/`); // Debug URL

    const response = await fetch(`${API_URL}/api/events/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Full error response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers),
        body: errorData
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received events:', data);
    
    const transformedData = data.map((event: any) => ({
      ...event,
      id: Number(event.id),
      event_date: event.event_date,
      name: event.name || '',
      day: event.day || '',
      time: event.time || '',
      location: event.location || '',
      details: event.details || '',
      source: event.source || '',
      price: event.price || '',
      image_url: event.image_url || event.imageUrl || '',
    }));

    localStorage.setItem('events', JSON.stringify(transformedData));
    localStorage.setItem('eventsTimestamp', Date.now().toString());
    
    return transformedData;
  } catch (error) {
    console.error('Error details:', error);
    return []; // Return empty array on error
  }
};

export default fetchEvents; 