// services/api.js
import axios from "axios";

export const API_BASE_URL = "http://127.0.0.1:8000/api";
// Fetch all events
export const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/salsas/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw new Error("Unable to fetch events. Please try again later.");
    }
  };

// Existing fetchEventDetails function
export const fetchEventDetails = async (id) => {
  try {
    const response = await axios.get(`/api/salsas/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching event details:", error);
    throw error;
  }
};
