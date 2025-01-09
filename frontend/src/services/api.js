// services/api.js
import axios from "axios";

// Use environment variable to switch between local and production URLs
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? "https://salsa-backend.onrender.com"
  : "http://127.0.0.1:8000";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add caching layer
let eventsCache = null;
let lastFetch = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Add cache for individual events
const eventDetailsCache = new Map();

export const fetchEvents = async () => {
    try {
      // Check cache first
      if (eventsCache && lastFetch && (Date.now() - lastFetch < CACHE_DURATION)) {
        return eventsCache;
      }

      console.log('Fetching from:', `${API_BASE_URL}/api/salsas/`); // Debug log
      const response = await api.get('/api/salsas/');
      console.log('Response:', response.data); // Debug log
      
      // Update cache
      eventsCache = response.data;
      lastFetch = Date.now();
      return response.data;
    } catch (error) {
      console.error("Error details:", {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error("Unable to fetch events. Please try again later.");
    }
};

export const fetchEventDetails = async (id) => {
  try {
    // Check cache first
    if (eventDetailsCache.has(id)) {
      const cached = eventDetailsCache.get(id);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }
    }

    const response = await api.get(`/api/salsas/${id}/`);
    // Update cache
    eventDetailsCache.set(id, {
      data: response.data,
      timestamp: Date.now()
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching event details:", error);
    throw new Error("Unable to fetch event details. Please try again later.");
  }
};

// Add cleanup function to prevent memory leaks
export const clearCaches = () => {
  eventsCache = null;
  lastFetch = null;
  eventDetailsCache.clear();
};

