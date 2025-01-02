import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import './styles/index.css';

function App() {
  return (
    <Router>
      {/* Navbar is outside of Routes, it will be displayed on every page */}
      <Navbar /> 
      
      <main>
        <Routes>
          {/* Define Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/calendar" element={<EventsPage />} />
          <Route path="/event/:id" element={<EventDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* Add more routes as necessary */}
        </Routes>
      </main>
      
      {/* Footer is outside of Routes, it will be displayed on every page */}
      <Footer />
    </Router>
  );
}

export default App;

