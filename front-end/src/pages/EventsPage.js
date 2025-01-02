import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the styles for the calendar
import EventCard from '../components/EventCard';
import Navbar from '../components/Navbar'; // Make sure to import Navbar if it's not already
import Footer from '../components/Footer'; // Make sure to import Footer if it's not already

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date()); // State to hold the selected date
  const [filteredEvents, setFilteredEvents] = useState([]); // Events filtered by selected date

  // Fetch events from API
  useEffect(() => {
    axios.get('/api/events') // Replace with your API endpoint
      .then(response => {
        setEvents(response.data);
        setFilteredEvents(response.data); // Initially show all events
      })
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  // Filter events based on selected date
  useEffect(() => {
    const filtered = events.filter(event => {
      // Assuming event.date is a string or Date object; adjust if necessary
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
    setFilteredEvents(filtered);
  }, [date, events]); // Re-filter events whenever the date changes

  const handleDateChange = (newDate) => {
    setDate(newDate); // Update the selected date
  };

  return (
    <div>
      <Navbar /> {/* Navbar component */}
      <main>
        <h2>Upcoming Salsa Events</h2>
        <div className="calendar-container">
          <h3>Select a Date</h3>
          <Calendar onChange={handleDateChange} value={date} />
        </div>
        <h3>Events on {date.toDateString()}</h3>
        <div className="events-list">
          {/* Display filtered events */}
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <p>No events found for this date.</p>
          )}
        </div>
      </main>
      <Footer /> {/* Footer component */}
    </div>
  );
}

export default EventsPage;
