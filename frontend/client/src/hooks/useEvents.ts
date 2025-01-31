import { API_URL } from '@/config';

const fetchEvents = async () => {
  try {
    // Make sure API_URL doesn't end with a slash
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    const apiUrl = `${baseUrl}/events/`;
    
    console.log('Base URL:', baseUrl);
    console.log('Full request URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
      },
      mode: 'cors',  // Add this
      credentials: 'omit'
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
  } catch (error: any) {
    console.error('Fetch error:', {
      message: error?.message || 'Unknown error',
      status: error?.status,
      url: API_URL  // Log the URL in errors too
    });
    throw error;
  }
};

export default fetchEvents; 