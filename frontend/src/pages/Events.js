// src/pages/Events.js
import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../services/api';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getEvents = async () => {
      setLoading(true);
      try {
        console.log('Fetching events...'); // Debug log
        const data = await fetchEvents();
        console.log('Events received:', data); // Debug log
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, []);

  if (loading) {
    return <div className="events-container"><div className="loading">Loading events...</div></div>;
  }

  if (error) {
    return <div className="events-container"><div className="error">Error: {error}</div></div>;
  }

  return (
    <div className="events-container">
      <div className="events-header">
        <h1 className="text-center">Salsa Events</h1>
      </div>
      
      <div className="events-grid">
        {events.length > 0 ? (
          events.map((event) => (
            <div className="event-card" key={event.id}>
              <div className="event-image">
                {/* Placeholder for event image */}
                <div className="event-placeholder"></div>
              </div>
              
              <div className="event-content">
                <div className="event-time-location">
                  <span>{event.time || 'Time TBA'} • {event.location || 'Location TBA'}</span>
                </div>
                
                <h2 className="event-title">{event.name}</h2>
                
                <div className="event-organizer">
                  <div className="organizer-avatar"></div>
                  <span>{event.source || 'Salsa Community Events'}</span>
                </div>
                
                <div className="event-details">
                  {event.price && (
                    <div className="detail-item">
                      <div className="detail-icon price-icon">💰</div>
                      <div className="detail-text">
                        <span>Event Fee</span>
                        <strong>{event.price}</strong>
                      </div>
                    </div>
                  )}
                  
                  <div className="detail-item">
                    <div className="detail-icon calendar-icon">📅</div>
                    <div className="detail-text">
                      <span>{new Date(event.event_date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                      <strong>{event.time || 'Time TBA'}</strong>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <div className="detail-icon location-icon">📍</div>
                    <div className="detail-text">
                      <strong>{event.location || 'Location TBA'}</strong>
                    </div>
                  </div>
                </div>
                
                {event.details && (
                  <div className="event-description">
                    <h3>Event Details</h3>
                    <p>{event.details}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="no-events">No events available at the moment. Please check back later.</p>
        )}
      </div>
    </div>
  );
};

export default Events;
