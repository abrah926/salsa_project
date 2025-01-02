import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEventDetails } from '../services/api';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const getEventDetails = async () => {
      const data = await fetchEventDetails(id);
      setEvent(data);
    };

    getEventDetails();
  }, [id]);

  if (!event) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>{event.name}</h1>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Date:</strong> {event.event_date}</p>
      <p><strong>Details:</strong> {event.details}</p>
    </div>
  );
};

export default EventDetails;
