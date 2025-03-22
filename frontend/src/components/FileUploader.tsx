import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadStatus('Uploading file...');
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadStatus(`File uploaded successfully: ${response.data.message}`);

      // Navigate back to the Data Table route
      navigate('/');
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Failed to upload file.');
    }
  };

  return (
    <div>
      <h2>Upload CSV File</h2>
      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload} disabled={!file}>
        Upload
      </button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default FileUploader;