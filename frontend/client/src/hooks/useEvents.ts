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
    return data;
  } catch (error: any) {
    console.error('Fetch error:', {
      message: error?.message || 'Unknown error',
      status: error?.status,
      url: API_URL
    });
    throw error;
  }
};

export default fetchEvents; 