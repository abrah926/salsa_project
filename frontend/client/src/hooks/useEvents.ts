import { API_URL } from '@/config';
import { Event } from '@/types/event';
import { useQuery, useQueryClient, UseQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;

const fetchEvents = async (): Promise<Event[]> => {
  try {
    console.log('Fetching from URL:', `${API_URL}/events/`);

    const response = await fetch(`${API_URL}/events/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      credentials: 'omit',
      signal: AbortSignal.timeout(30000)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw events data from API:', data);

    console.log('Events dates:', data.map((e: Event) => ({
      id: e.id,
      date: e.event_date,
      name: e.name
    })));

    console.log('Total events from API:', data.length);
    console.log('First event date:', data[0]?.event_date);
    console.log('Last event date:', data[data.length - 1]?.event_date);

    if (!Array.isArray(data)) {
      console.error('Expected array of events but got:', typeof data);
      return [];
    }

    return data.map(event => ({
      ...event,
      event_date: event.event_date ? event.event_date.split('T')[0] : null
    }));
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      console.log('Retrying fetch due to timeout...');
      const retryResponse = await fetch(`${API_URL}/events/`, {
        signal: AbortSignal.timeout(60000)
      });
      return retryResponse.json();
    }
    console.error('Fetch error:', error);
    return [];
  }
};

interface EventPreview {
  id: number;
  name: string;
  event_date: string;
  location: string;
}

const useEventPreview = () => {
  return useQuery<EventPreview[], Error>({
    queryKey: ["events-preview"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/events/preview`);
      return response.json();
    }
  });
};

const useEventDetails = (eventId: number) => {
  return useQuery<Event, Error>({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/events/${eventId}`);
      return response.json();
    },
    enabled: !!eventId
  });
};

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Event[];
}

export const useEvents = () => {
  const result = useInfiniteQuery<PaginatedResponse>({
    queryKey: ['events'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(`${API_URL}/events/?page=${pageParam}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const nextPage = new URLSearchParams(new URL(lastPage.next).search).get('page');
      return nextPage ? parseInt(nextPage) : undefined;
    },
    retry: true,
    retryDelay: 500, // Retry every 0.5 seconds
    initialPageParam: 1
  });

  useEffect(() => {
    if (result.data?.pages[result.data.pages.length - 1].next) {
      result.fetchNextPage();
    }
  }, [result.data]);

  return result;
};

const sortEvents = (events: Event[]) => {
  return events.sort((a, b) => 
    new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
  );
};

export { useEventPreview, useEventDetails, sortEvents };
export default fetchEvents; 