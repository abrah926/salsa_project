import { API_URL } from '@/config';

const fetchEvents = async () => {
  try {
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    console.log('Fetching from URL:', `${baseUrl}/events/`); // Debug URL

    const response = await fetch(`${baseUrl}/events/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      credentials: 'include'  // Changed from 'omit' to 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data); // Debug response
    if (!Array.isArray(data)) {
      console.error('Expected array of events, got:', data);
      return [];
    }
    return data;
  } catch (error: any) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export default fetchEvents; 