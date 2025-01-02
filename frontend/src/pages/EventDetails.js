import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchEventDetails } from "../services/api";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getEventDetails = async () => {
      try {
        const data = await fetchEventDetails(id);
        setEvent(data);
      } catch (err) {
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    getEventDetails();
  }, [id]);

  if (loading) return <div className="container mt-5">Loading event details...</div>;

  if (error) return <div className="container mt-5 text-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-3">{event.name}</h1>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Date:</strong> {event.event_date || "No Date Available"}
      </p>
      <p>
        <strong>Details:</strong> {event.details || "No Details Available"}
      </p>
      <button
        className="btn btn-secondary"
        onClick={() => window.history.back()}
      >
        Go Back
      </button>
    </div>
  );
};

export default EventDetails;
