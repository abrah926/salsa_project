import React, { useState, useEffect } from "react";
import { fetchEvents } from "../services/api";
import "./Calendar.css";
import moment from "moment";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [showCalendar, setShowCalendar] = useState(false);

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

  // Generate all dates for the selected month
  const generateDatesForMonth = () => {
    const startOfMonth = selectedMonth.clone().startOf("month");
    const endOfMonth = selectedMonth.clone().endOf("month");
    const dates = [];

    for (let date = startOfMonth; date.isBefore(endOfMonth); date.add(1, "day")) {
      dates.push(date.format("YYYY-MM-DD"));
    }
    return dates;
  };

  const dates = generateDatesForMonth();

  return (
    <div className="calendar-container">
      <div className="month-selector">
        <h2 onClick={() => setShowCalendar(!showCalendar)}>
          {selectedMonth.format("MMMM YYYY")} <span className="dropdown-arrow">&#9662;</span>
        </h2>
        {showCalendar && (
          <div className="calendar-popup">
            {dates.map((date) => (
              <div
                key={date}
                className="calendar-day"
                onClick={() => {
                  setSelectedMonth(moment(date));
                  setShowCalendar(false);
                }}
              >
                {moment(date).format("D")}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="event-list">
        {dates.map((date) => {
          const dayEvents = events.filter((event) => event.date === date);
          return (
            <div
              className="event-item"
              key={date}
              style={{ backgroundColor: generateColor(date) }}
            >
              <h3>{moment(date).format("MMMM Do, YYYY")}</h3>
              {dayEvents.length === 0 ? (
                <p className="no-events">No events for this date.</p>
              ) : (
                dayEvents.map((event, index) => (
                  <div className="event-card" key={index} style={{ backgroundColor: generateEventColor(index) }}>
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

// Generate vibrant and appealing colors for event cards
const generateColor = (key) => {
  const colors = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff", "#ffafcc"];
  const hash = key.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// Generate event-specific colors for more randomness
const generateEventColor = (index) => {
  const colors = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff", "#ffafcc"];
  return colors[index % colors.length];
};

export default Calendar;
