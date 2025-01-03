import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { fetchEvents } from "../services/api";

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate(); // React Router's navigation hook

  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await fetchEvents();
        const formattedEvents = data.map((event) => ({
          title: event.name,
          start: new Date(event.event_date),
          end: new Date(event.event_date),
          id: event.id, // Include the event ID for linking
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events for calendar:", error);
      }
    };

    getEvents();
  }, []);

  const handleSelectEvent = (event) => {
    // Navigate to the Event Details page when an event is clicked
    navigate(`/events/${event.id}`);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Event Calendar</h1>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleSelectEvent} // Attach the click handler
      />
    </div>
  );
};

export default Calendar;
