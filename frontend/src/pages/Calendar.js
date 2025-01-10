import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "../services/api";

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(true); // Toggle calendar visibility
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

  const handleSelectDate = (slotInfo) => {
    setSelectedDate(slotInfo.start); // Update selected date
  };

  const filteredEvents = selectedDate
    ? events.filter((event) => moment(event.start).isSame(selectedDate, "day"))
    : [];

  const toggleCalendar = () => {
    setCalendarVisible(!calendarVisible); // Toggle calendar visibility
  };

  return (
    <div className="calendar-container">
      <h1 className="calendar-header">Event Calendar</h1>
      <button className="toggle-calendar-btn" onClick={toggleCalendar}>
        {calendarVisible ? "Hide Calendar" : "Show Calendar"}
      </button>
      {calendarVisible && (
        <BigCalendar
          localizer={localizer}
          events={[]} // Remove events from calendar cells
          selectable={true} // Enable date selection
          onSelectSlot={handleSelectDate} // Handle date selection
          style={{ height: 500, marginBottom: 20 }}
        />
      )}
      <div className="event-list">
        <h2>
          Events for {selectedDate ? moment(selectedDate).format("MMMM Do, YYYY") : "Selected Date"}
        </h2>
        {filteredEvents.length === 0 ? (
          <p className="no-events">No events for this date.</p>
        ) : (
          filteredEvents.map((event) => (
            <div className="event-item" key={event.id}>
              <h3>{event.title}</h3>
              <p>
                {moment(event.start).format("h:mm A")} - {moment(event.end).format("h:mm A")}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Calendar;
