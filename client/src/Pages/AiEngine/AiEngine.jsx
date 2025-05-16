import React, { useState } from 'react';
import { db } from '../../firebase/firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext.jsx';
import './AiEngine.css';

function AiEngine() {
  const { user } = useAuth();
  const [videoFile, setVideoFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [heatmaps, setHeatmaps] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
    setPrediction(null);
    setHeatmaps([]);
  };

  const saveDetectionRecord = async (videoName, label) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'detections'), {
        userId: user.uid,
        videoName,
        label,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error saving detection:', error);
    }
  };

  const handleDetect = async () => {
    if (!videoFile) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('video', videoFile);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setPrediction(data.prediction);
      setHeatmaps(data.heatmaps.map(h => `http://localhost:5000${h}`));

      if (data.prediction?.label) {
        await saveDetectionRecord(videoFile.name, data.prediction.label.toLowerCase());
      }
    } catch (error) {
      console.error('Detection error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="main-heading">Face The Truth</h1>

      <div className="upload-box">
        <h2>Upload a Video</h2>
        <input type="file" accept="video/*" onChange={handleFileChange} />
        <button onClick={handleDetect} disabled={!videoFile || loading}>
          {loading ? 'Detecting...' : 'Detect'}
        </button>
      </div>

      {/* ✅ Video Preview */}
      {videoFile && (
        <div style={{ marginTop: '20px' }}>
          <h2>Video Preview</h2>
          <video
            src={URL.createObjectURL(videoFile)}
            controls
            width="500"
            style={{ borderRadius: '10px', marginTop: '10px' }}
          />
        </div>
      )}

      {prediction && (
        <div className="prediction-box">
          <h2>Prediction Result</h2>

          {/* ✅ Dynamic Label Color */}
          <p
            className="label"
            style={{
              color:
                prediction.label.toLowerCase() === 'real'
                  ? 'limegreen'
                  : prediction.label.toLowerCase() === 'fake'
                  ? 'red'
                  : 'white',
              fontWeight: 'bold',
            }}
          >
            Label: {prediction.label}
          </p>

          {/* ✅ Fix confidence formatting */}
          <p className="confidence">
            Confidence:{' '}
            {prediction.confidence > 1
              ? prediction.confidence.toFixed(2)
              : (prediction.confidence * 100).toFixed(2)}
            %
          </p>
        </div>
      )}

      {heatmaps.length > 0 && (
        <div className="heatmap-gallery">
          <h2>Heatmaps</h2>
          <div className="heatmap-grid">
            {heatmaps.map((url, i) => (
              <img key={i} src={url} alt={`Heatmap ${i + 1}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AiEngine;
