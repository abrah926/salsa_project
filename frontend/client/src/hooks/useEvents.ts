import { API_URL } from '@/config';

const fetchEvents = async () => {
  try {
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
    console.log('API Response:', data[0]); // Log first event to check structure
    return data;
  } catch (error: any) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export default fetchEvents; 