import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../services/api';

const Home = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getEvents = async () => {
      const data = await fetchEvents();
      setEvents(data);
    };

    getEvents();
  }, []);

  return (
    <div className="container">
      <h1 className="my-4">Salsa Events</h1>
      <ul className="list-group">
        {events.map((event) => (
          <li key={event.id} className="list-group-item">
            <h5>{event.name}</h5>
            <p>{event.location}</p>
            <p>{event.event_date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
