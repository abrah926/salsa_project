import { API_URL } from '@/config';

const fetchEvents = async () => {
  // Log the API_URL value first
  console.log('API_URL from config:', API_URL);

  try {
    const apiUrl = `${API_URL}/events/`;
    console.log('Full request URL:', apiUrl);
    
    // Add more request options
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      credentials: 'omit'  // Try without credentials first
    });

    // Log response details safely
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Successfully parsed data:', data);
    return data;
  } catch (error: any) { // Type assertion for error
    console.error('Fetch error:', {
      message: error?.message || 'Unknown error',
      status: error?.status,
    });
    throw error;
  }
};

export default fetchEvents; 