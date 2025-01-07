import axios from "axios";

const API_BASE_URL = "https://salsa-backend.onrender.com/api";

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