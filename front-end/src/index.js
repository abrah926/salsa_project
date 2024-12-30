import React from 'react';
import ReactDOM from 'react-dom/client'; // Correct import for React 18
import './styles/index.css'; // Optional for global styles
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root
root.render(<App />); // Use render on the root
