import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import gif from '../../assets/gif.mp4'

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Section: What Are Deepfakes */}
      <section className="deepfake-section">
        <h1 className="title">What Are Deepfakes?</h1>

        <p className="deepfake-description">
          Deepfakes are hyper-realistic videos, images, or audio recordings generated using artificial intelligence. These manipulations can 
          replace someone’s face or voice with another person's likeness, often with the intent to deceive. Using advanced deep learning techniques, 
          they can clone facial expressions, speech patterns, and even emotions with alarming accuracy.
        </p>
        <p className="deepfake-description">
          While deepfakes can be used for creative and educational purposes, they’re also a rising threat in misinformation campaigns, identity theft,
          fraud, and political manipulation. Their misuse challenges how we verify truth in a digital-first world.
        </p>
        <center>
        <div className="video-container">
  <video autoPlay loop muted className="deepfake-video">
    <source src={gif} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>

        </center>

        <div className="awareness-container">
          <div className="glass-card">
            <h2 className="card-title">⚠️ Awareness Points</h2>
            <ul className="awareness-list">
              <li>📰 Deepfakes spread fake news rapidly</li>
              <li>🎭 Impersonation of leaders and influencers</li>
              <li>🔐 Threat to privacy and national security</li>
              <li>🧠 Manipulates public perception and trust</li>
              <li>📉 Undermines evidence and justice systems</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section: Solution */}
      <section className="solution-section">
        <h2 className="solution-heading">Our Solution</h2>
        <p className="solution-description">
          We developed an AI-driven system that uses advanced detection techniques to analyze video frames and classify them as real or fake, providing visual evidence with bounding boxes and heatmaps to support accurate decision-making.
        </p>
        <button className="solution-btn" onClick={() => navigate('/project')}>
          About Project
        </button>
      </section>
    </div>
  );
}
