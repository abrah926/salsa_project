import axios from 'axios';

const BASE_URL = "http://127.0.0.1:8000/api";

export const getSalsaEvents = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/salsas/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching salsa events:", error);
    throw error;
  }
};
