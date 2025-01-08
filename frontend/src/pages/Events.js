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
    <div className="container mt-5" style={{ backgroundColor: 'black', color: 'white', padding: '20px', borderRadius: '10px' }}>
      <h1 className="my-4 text-center" style={{ fontWeight: 'bold', color: '#ff6347' }}>Salsa Events</h1>
      {events.length > 0 ? (
        <div className="row">
          {events.map((event) => (
            <div className="col-md-6 col-lg-4 mb-4" key={event.id}>
              <div className="card" style={{ backgroundColor: '#1c1c1c', color: 'white', border: '1px solid #ff6347' }}>
                <div className="card-body">
                  <h5 className="card-title" style={{ fontWeight: 'bold', color: '#ff6347' }}>{event.name}</h5>
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
