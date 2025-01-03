import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const fetchEvents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/salsas/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const fetchEventDetails = async (eventId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/salsas/${eventId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for event ID ${eventId}:`, error);
    throw error;
  }
};