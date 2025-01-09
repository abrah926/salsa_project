// src/pages/Events.js
import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../services/api';

// Move styles outside component to prevent recreation on each render
const containerStyle = {
  backgroundColor: 'black',
  color: 'white',
  padding: '20px',
  borderRadius: '10px'
};

const titleStyle = {
  fontWeight: 'bold',
  color: '#ff6347'
};

const cardStyle = {
  backgroundColor: '#1c1c1c',
  color: 'white',
  border: '1px solid #ff6347'
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getEvents = async () => {
      setLoading(true);
      try {
        const data = await fetchEvents();
        setEvents(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Unable to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5" style={containerStyle}>
        <div className="text-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5" style={containerStyle}>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5" style={containerStyle}>
      <h1 className="my-4 text-center" style={titleStyle}>Salsa Events</h1>
      {events.length > 0 ? (
        <div className="row">
          {events.map((event) => (
            <div className="col-md-6 col-lg-4 mb-4" key={event.id}>
              <div className="card" style={cardStyle}>
                <div className="card-body">
                  <h5 className="card-title" style={titleStyle}>{event.name}</h5>
                  <p className="card-text">{event.location || 'Location not specified'}</p>
                  <p className="card-text"><strong>Date:</strong> {event.event_date}</p>
                  <p className="card-text"><strong>Time:</strong> {event.time || 'Time not specified'}</p>
                  <p className="card-text"><strong>Recurrence:</strong> {event.recurrence || 'None'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No events available at the moment. Please check back later.</p>
      )}
    </div>
  );
};

export default Events;
