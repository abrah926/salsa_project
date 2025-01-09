import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateEvent.css';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    name: '',
    location: '',
    event_date: '',
    time: '',
    details: '',
    price: '',
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
    try {
      // Add your API call here to create the event
      console.log('Creating event:', eventData);
      navigate('/events'); // Redirect to events page after creation
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className="create-event-container">
      <div className="create-event-header">
        <button onClick={() => navigate(-1)} className="back-button">←</button>
        <h1>Create Event</h1>
      </div>

      <div className="event-banner">
        <div className="upload-placeholder">
          <span>+ Upload Event Banner</span>
        </div>
      </div>

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
            <label>Start Date</label>
            <input
              type="date"
              name="event_date"
              value={eventData.event_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group half">
            <label>Start Time</label>
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

        <button type="submit" className="submit-button">
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;