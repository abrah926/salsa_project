import { API_URL } from '@/config';
import { type Event } from '@db/schema';

const CACHE_KEY = 'initial_events';
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

const fetchEvents = async () => {
  try {
    // Try to get from browser cache first
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TIME) {
        console.log('Using cached events');
        return data;
      }
    }

    // If no cache or expired, fetch from API
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    const response = await fetch(`${baseUrl}/events/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    // Cache the response
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));

    return data;
  } catch (error: any) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export default fetchEvents; 