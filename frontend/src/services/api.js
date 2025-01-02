import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // Backend URL
});

export const fetchEvents = async () => {
  const response = await API.get('/salsas/');
  return response.data;
};

export const fetchEventDetails = async (id) => {
  const response = await API.get(`/salsas/${id}/`);
  return response.data;
};

export default API;
