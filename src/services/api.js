// Add caching layer
let eventsCache = null;
let lastFetch = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchEvents = async () => {
    try {
      // Check cache first
      if (eventsCache && lastFetch && (Date.now() - lastFetch < CACHE_DURATION)) {
        return eventsCache;
      }

      const response = await axios.get(`${API_BASE_URL}/salsas/`);
      // Update cache
      eventsCache = response.data;
      lastFetch = Date.now();
      return response.data;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw new Error("Unable to fetch events. Please try again later.");
    }
}; 