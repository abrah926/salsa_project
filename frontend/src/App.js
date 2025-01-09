import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";

// Lazy load components
const Home = lazy(() => import("./pages/Home"));
const Events = lazy(() => import("./pages/Events"));
const EventDetails = lazy(() => import("./pages/EventDetails"));
const Calendar = lazy(() => import("./pages/Calendar"));

function App() {
  return (
    <Router>
      <Navbar />
      <Suspense fallback={<div className="container mt-5">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route
            path="/contact"
            element={
              <div className="container mt-5">
                <h1>Contact Us</h1>
                <p>If you have any questions, feel free to reach out!</p>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;