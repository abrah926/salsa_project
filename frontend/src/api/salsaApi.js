import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const fetchEventDetails = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/salsas/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching event details:", error);
    throw error;
  }
};
