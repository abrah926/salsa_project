import React, { useState, useEffect } from "react";
import { fetchEvents } from "../services/api";
import "./Calendar.css";
import moment from "moment";

const Calendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await fetchEvents();
        const formattedEvents = data.map((event) => ({
          title: event.name,
          date: moment(event.event_date).format("YYYY-MM-DD"),
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events for calendar:", error);
      }
    };

    getEvents();
  }, []);

  // Generate all dates for the current month
  const generateDatesForMonth = () => {
    const startOfMonth = moment().startOf("month");
    const endOfMonth = moment().endOf("month");
    const dates = [];

    for (let date = startOfMonth; date.isBefore(endOfMonth); date.add(1, "day")) {
      dates.push(date.format("YYYY-MM-DD"));
    }
    return dates;
  };

  const dates = generateDatesForMonth();

  return (
    <div className="calendar-container">
      <h1 className="calendar-header">Event Calendar</h1>
      <div className="event-list">
        {dates.map((date) => {
          const dayEvents = events.filter((event) => event.date === date);
          return (
            <div className="event-item" key={date}>
              <h3>{moment(date).format("MMMM Do, YYYY")}</h3>
              {dayEvents.length === 0 ? (
                <p className="no-events">No events for this date.</p>
              ) : (
                dayEvents.map((event, index) => (
                  <div
                    className="event-card"
                    key={index}
                    style={{ backgroundColor: generateColor(index) }}
                  >
                    <p>{event.title}</p>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Generate vibrant colors for event cards
const generateColor = (index) => {
  const colors = ["#f28b82", "#fbbc04", "#34a853", "#4285f4", "#d7aefb", "#46bdc6"];
  return colors[index % colors.length];
};

export default Calendar;
