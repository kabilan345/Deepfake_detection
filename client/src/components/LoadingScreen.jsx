// components/LoadingScreen.jsx
import React from 'react';
import './LoadingScreen.css'; // Use animation/spinner styles

const LoadingScreen = () => (
  <div className="loading-container">
    <div className="spinner-loading"></div>
    <p>Loading...</p>
  </div>
);

export default LoadingScreen;
