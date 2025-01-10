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

  const handleDateClick = (date) => {
    const eventCard = document.getElementById(`event-${date}`);
    if (eventCard) {
      eventCard.scrollIntoView({ behavior: "smooth" });
      setShowCalendar(false);
    }
  };

  return (
    <div className="calendar-container">
      <div className="month-selector">
        <h2 onClick={() => setShowCalendar(!showCalendar)}>
          {selectedMonth.format("MMMM YYYY")} <span className="dropdown-arrow">&#9662;</span>
        </h2>
        {showCalendar && (
          <div className="calendar-popup">
            <table className="mini-calendar">
              <thead>
                <tr>
                  {moment.weekdaysShort().map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, weekIndex) => (
                  <tr key={weekIndex}>
                    {Array.from({ length: 7 }).map((_, dayIndex) => {
                      const currentDay = selectedMonth.clone()
                        .startOf("month")
                        .startOf("week")
                        .add(weekIndex * 7 + dayIndex, "days");
                      return (
                        <td
                          key={dayIndex}
                          className={
                            currentDay.month() === selectedMonth.month()
                              ? "current-month"
                              : "other-month"
                          }
                          onClick={() => handleDateClick(currentDay.format("YYYY-MM-DD"))}
                        >
                          {currentDay.date()}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="event-list">
        {dates.map((date) => {
          const dayEvents = events.filter((event) => event.date === date);
          return (
            <div
              id={`event-${date}`}
              className="event-item"
              key={date}
              style={{ backgroundColor: generateColor(date), border: "1px solid black" }}
            >
              <h3>{moment(date).format("MMMM Do, YYYY")}</h3>
              {dayEvents.length === 0 ? (
                <p className="no-events">No events for this date.</p>
              ) : (
                dayEvents.map((event, index) => (
                  <div
                    className="event-card"
                    key={index}
                    style={{
                      backgroundColor: generateEventColor(index),
                      border: "1px solid black",
                      margin: "5px 0",
                      padding: "5px",
                    }}
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

// Generate vibrant and appealing colors for event cards
const generateColor = (key) => {
  const colors = ["#A239CA", "#FF3F81", "#3A86FF", "#8338EC", "#FF006E", "#FB5607", "#FFBE0B", "#FF9F1C"];
  const hash = key.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// Generate event-specific colors for more randomness
const generateEventColor = (index) => {
  const colors = ["#A239CA", "#FF3F81", "#3A86FF", "#8338EC", "#FF006E", "#FB5607", "#FFBE0B", "#FF9F1C"];
  return colors[index % colors.length];
};

export default Calendar;
