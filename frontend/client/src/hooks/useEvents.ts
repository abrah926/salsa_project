import { API_URL } from '@/config';
import { Event } from '@/types/event';

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;

const fetchEvents = async (): Promise<Event[]> => {
  try {
    console.log('Fetching from URL:', `${API_URL}/events/`);

    const response = await fetch(`${API_URL}/events/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      credentials: 'omit',
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw events data from API:', data);

    console.log('Events dates:', data.map((e: Event) => ({
      id: e.id,
      date: e.event_date,
      name: e.name
    })));

    if (!Array.isArray(data)) {
      console.error('Expected array of events but got:', typeof data);
      return [];
    }

    return data.map(event => ({
      ...event,
      event_date: event.event_date ? event.event_date.split('T')[0] : null
    }));
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};

export default fetchEvents; 