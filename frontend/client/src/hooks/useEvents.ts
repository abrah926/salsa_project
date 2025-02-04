import { API_URL } from '@/config';
import { Event } from '@/types/event';

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;

const fetchEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch(`${API_URL}/events/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Server response:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received events:', data); // Debug log
    localStorage.setItem('events', JSON.stringify(data));
    localStorage.setItem('eventsTimestamp', Date.now().toString());
    
    return data;
  } catch (error) {
    console.error('Error details:', error);
    return []; // Return empty array on error
  }
};

export default fetchEvents; 