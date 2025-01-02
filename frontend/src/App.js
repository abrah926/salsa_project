import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/events" element={<Events />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

function Events() {
  return (
    <div className="container mt-5">
      <h1>Events Page</h1>
      <p>Here you will find all the exciting salsa events happening soon.</p>
    </div>
  );
}

function About() {
  return (
    <div className="container mt-5">
      <h1>About Salsa Events</h1>
      <p>Learn more about our mission to bring the joy of salsa to everyone.</p>
    </div>
  );
}

function Contact() {
  return (
    <div className="container mt-5">
      <h1>Contact Us</h1>
      <p>For inquiries, please email us at info@salsaevents.com.</p>
    </div>
  );
}

export default App;
