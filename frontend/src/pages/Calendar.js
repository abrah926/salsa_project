import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchEvents } from "../services/api";

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await fetchEvents();
        const formattedEvents = data.map((event) => ({
          title: event.name,
          start: new Date(event.event_date),
          end: new Date(event.event_date),
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events for calendar:", error);
      }
    };

    getEvents();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Event Calendar</h1>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default Calendar;
