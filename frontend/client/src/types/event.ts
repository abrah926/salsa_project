export interface Event {
  id: number;
  event_date: string;
  name: string;
  day: string;
  time: string;
  location: string;
  details: string;
  source?: string;
  price?: string;
  recurrence?: string;
  recurrence_interval?: number;
  end_recurring_date?: string | null;
  image_url?: string;
  imageUrl?: string;
  created_at?: string;
  updated_at?: string;
  eventDate?: string;
  recurrenceInterval?: number;
  endRecurringDate?: string;
  createdAt?: string;
  updatedAt?: string;
} 
