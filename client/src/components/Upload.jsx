
import React, { useState } from 'react';
import axios from 'axios';

function UploadForm({ onUploadComplete }) {
  const [videoURL, setVideoURL] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const videoBlob = URL.createObjectURL(file);
    setVideoURL(videoBlob);

    const formData = new FormData();
    formData.append('video', file);

    const response = await axios.post('http://localhost:5000/upload', formData);
    onUploadComplete(response.data);
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleUpload} />
      {videoURL && (
        <video controls width="600" src={videoURL} style={{ marginTop: '20px' }} />
      )}
    </div>
  );
}

export default UploadForm;
