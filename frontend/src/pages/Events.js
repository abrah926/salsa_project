// src/pages/Events.js
import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../services/api';

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    getEvents();
  }, []);

  return (
    <div style={{ backgroundColor: "#000", minHeight: "100vh", padding: "20px" }}>
      <div className="container">
        <h1 className="text-center text-white mb-4">Salsa Events</h1>
        {events.length > 0 ? (
          <div className="row">
            {events.map((event) => (
              <div key={event.id} className="col-md-6 col-lg-4 mb-4">
                <div
                  className="card"
                  style={{
                    backgroundColor: "#1c1c1c",
                    color: "white",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    padding: "15px",
                  }}
                >
                  <h5 style={{ marginBottom: "10px" }}>{event.name}</h5>
                  <p style={{ marginBottom: "5px" }}>
                    <strong>Location:</strong> {event.location}
                  </p>
                  <p style={{ marginBottom: "5px" }}>
                    <strong>Date:</strong> {event.event_date}
                  </p>
                  {event.time && (
                    <p style={{ marginBottom: "5px" }}>
                      <strong>Time:</strong> {event.time}
                    </p>
                  )}
                  {event.price && (
                    <p style={{ marginBottom: "5px" }}>
                      <strong>Price:</strong> {event.price}
                    </p>
                  )}
                  {event.details && (
                    <p style={{ marginBottom: "5px" }}>
                      <strong>Details:</strong> {event.details}
                    </p>
                  )}
                  {event.source && (
                    <p style={{ marginBottom: "0" }}>
                      <strong>Source:</strong>{" "}
                      <a href={event.source} target="_blank" rel="noopener noreferrer" style={{ color: "#e63946" }}>
                        Event Link
                      </a>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white text-center">No events available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Events;
