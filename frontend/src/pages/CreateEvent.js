import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../services/api';
import './CreateEvent.css';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [eventData, setEventData] = useState({
    name: '',
    location: '',
    event_date: '',
    time: '',
    details: '',
    price: '',
    recurrence: '', // Optional: Add if you want recurring events
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Format the data to match your Django model
      const formattedData = {
        ...eventData,
        // Ensure date is in YYYY-MM-DD format
        event_date: eventData.event_date,
        // Ensure time is in HH:MM format
        time: eventData.time,
        // Add any default values or transformations needed
        source: 'Web Form',
      };

      await createEvent(formattedData);
      // Show success message (you can add a toast notification here)
      alert('Event created successfully!');
      // Redirect to events page
      navigate('/events');
    } catch (error) {
      setError(error.message);
      // You can add a better error display here
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-container">
      <div className="create-event-header">
        <button onClick={() => navigate(-1)} className="back-button">←</button>
        <h1>Create Event</h1>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label>Event Title</label>
          <input
            type="text"
            name="name"
            value={eventData.name}
            onChange={handleChange}
            placeholder="Enter event title"
            required
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            placeholder="Enter location"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label>Date</label>
            <input
              type="date"
              name="event_date"
              value={eventData.event_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group half">
            <label>Time</label>
            <input
              type="time"
              name="time"
              value={eventData.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Price</label>
          <input
            type="text"
            name="price"
            value={eventData.price}
            onChange={handleChange}
            placeholder="Enter price (or 'Free')"
          />
        </div>

        <div className="form-group">
          <label>Event Details</label>
          <textarea
            name="details"
            value={eventData.details}
            onChange={handleChange}
            placeholder="Enter event description..."
            rows="4"
            required
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Creating Event...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;