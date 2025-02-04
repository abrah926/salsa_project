import { API_URL } from '@/config';
import { Event } from '@/types/event';

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;

const fetchEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch(`${API_URL}/api/events/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Event[] = await response.json();
    localStorage.setItem('events', JSON.stringify(data));
    localStorage.setItem('eventsTimestamp', Date.now().toString());
    
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    
    const cachedData = localStorage.getItem('events');
    const timestamp = localStorage.getItem('eventsTimestamp');
    
    if (cachedData && timestamp) {
      const age = Date.now() - parseInt(timestamp);
      if (age < 24 * 60 * 60 * 1000) {
        console.log('Using cached event data');
        return JSON.parse(cachedData) as Event[];
      }
    }
    
    throw error;
  }
};

export default fetchEvents; 