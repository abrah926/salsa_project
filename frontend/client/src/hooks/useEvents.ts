const fetchEvents = async () => {
  try {
    console.log('Fetching from:', API_URL); // Debug log
    const response = await fetch(`${API_URL}/api/events/`);
    console.log('Response status:', response.status); // Debug log
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Received data:', data); // Debug log
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}; 