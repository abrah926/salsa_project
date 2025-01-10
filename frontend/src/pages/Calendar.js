import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css"; // Import CSS for styling
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "../services/api";

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // State for selected date
  const navigate = useNavigate();

  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await fetchEvents();
        const formattedEvents = data.map((event) => ({
          title: event.name,
          start: new Date(event.event_date),
          end: new Date(event.event_date),
          id: event.id,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events for calendar:", error);
      }
    };

    getEvents();
  }, []);

  const handleSelectEvent = (event) => {
    navigate(`/events/${event.id}`);
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date); // Update selected date
  };

  const filteredEvents = selectedDate
    ? events.filter(
        (event) =>
          moment(event.start).isSame(selectedDate, "day") // Compare dates
      )
    : [];

  return (
    <div className="calendar-container">
      <h1 className="calendar-header">Event Calendar</h1>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable={true} // Make dates selectable
        onNavigate={(date) => handleSelectDate(date)} // Update selected date
        onSelectEvent={handleSelectEvent}
      />
      <div className="event-list">
        <h2>Events for {selectedDate ? moment(selectedDate).format("MMMM Do, YYYY") : "Selected Date"}</h2>
        {filteredEvents.length === 0 ? (
          <p>No events for this date.</p>
        ) : (
          filteredEvents.map((event) => (
            <div className="event-item" key={event.id}>
              <h3>{event.title}</h3>
              <p>
                {moment(event.start).format("h:mm A")} -{" "}
                {moment(event.end).format("h:mm A")}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Calendar;
