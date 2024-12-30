import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';

function EventDetailPage() {
  const { eventId } = useParams();
  // TODO: Fetch event details using eventId

  return (
    <div>
      <Navbar />
      <main>
        <h2>Event Details</h2>
        {/* TODO: Render event details */}
      </main>
      <Footer />
    </div>
  );
}

export default EventDetailPage;
