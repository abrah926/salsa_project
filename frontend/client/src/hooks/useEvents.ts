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

    // Log everything about the response
    console.log('Response object:', response);
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Successfully parsed data:', data);
    return data;
  } catch (error) {
    console.error('Full error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

export default fetchEvents; 