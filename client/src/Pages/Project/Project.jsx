import React from 'react';
import './Project.css';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaVideo, FaSearch, FaRocket, FaShieldAlt, FaCheckCircle, FaCheck } from 'react-icons/fa';
import demo from '../../assets/Demo.mp4';

export default function Project() {
  const navigate = useNavigate();

  return (
    <div className="project-container">
      {/* Project Title & Overview */}
      <h1 className="project-title">Deepfake Detection System</h1>
      <p className="project-description">
        Deepfakes are AI-generated synthetic media where someone’s face or voice is altered to appear as someone else.
        Our project aims to combat this misinformation by providing a robust, real-time detection platform that can verify
        the authenticity of videos before they are trusted or shared.
      </p>

      {/* Uses & Importance */}
      <div className="section-box-glass">
        <h2 className="section-heading">📌 Why This Project Matters</h2>
        <p className="project-details">
          With the rise of fake news, identity fraud, and manipulated media, deepfakes pose a serious threat to individuals,
          organizations, and democratic institutions. Our system helps:
        </p>
        <ul className="features">
          <li><FaCheckCircle className="list-icon" /> Prevent media-based misinformation</li>
          <li><FaCheckCircle className="list-icon" /> Support journalists in verifying authenticity</li>
          <li><FaCheckCircle className="list-icon" /> Protect individuals from identity misuse</li>
          <li><FaCheckCircle className="list-icon" /> Assist researchers in studying AI-based threats</li>
        </ul>
      </div>

      {/* Motivational Quote */}
      <blockquote className="project-quote">
        "Truth has a voice—our AI gives it the power to be heard."
      </blockquote>

      {/* Why Choose Us */}
      <section className="section-box-glass">
  <h2 className="section-heading">🚀 Why Choose Us?</h2>
  <ul className="features-list">
    <li><FaRocket className="list-icon" /><span>Real-time detection with ResNet50</span></li>
    <li><FaShieldAlt className="list-icon" /><span>Face alignment improves precision</span></li>
    <li><FaCheck className="list-icon" /><span>Frame-level predictions with bounding boxes</span></li>
    <li><FaCheck className="list-icon" /><span>High accuracy on unseen and noisy data</span></li>
  </ul>
</section>

      {/* How It Works */}
      <section className="section-box-glass">
        <h2 className="section-heading">🔍 How It Works</h2>
        <div className="steps">
          <div className="step-card">
            <FaUpload className="icon" />
            <h3>Step 1</h3>
            <p>Upload a video (MP4, MOV, AVI supported)</p>
          </div>
          <div className="step-card">
            <FaVideo className="icon" />
            <h3>Step 2</h3>
            <p>System analyzes 10 critical frames using face detection</p>
          </div>
          <div className="step-card">
            <FaSearch className="icon" />
            <h3>Step 3</h3>
            <p>Detects deepfakes using ResNet50, shows frame-wise heatmaps</p>
          </div>
        </div>
      </section>

      {/* Demo */}
      <section className="section-box">
  <h2 className="section-heading">🎬 Demo Video </h2>
  <p className="subtext">"Detect the Truth in a Digital World"</p>
  <p className="light-text">
    Our AI-powered engine identifies deepfakes in videos with frame-level accuracy and visual evidence.
  </p>

  <div className="demo-thumbnail">
    <video
      src={demo}
      controls
      autoPlay
      muted
      loop
      className="demo-video"
    />
  </div>

  <button className="navigate-btn" onClick={() => navigate('/ai-engine')}>
    Try the AI Engine
  </button>
</section>

    </div>
  );
}
