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
      const errorData = await response.text();
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        data: errorData
      });
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};

export default fetchEvents; 