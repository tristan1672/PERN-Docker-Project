import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const FileUploader = () => {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
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
        }
        catch (error) {
            console.error('Error uploading file:', error);
            setUploadStatus('Failed to upload file.');
        }
    };
    return (_jsxs("div", { children: [_jsx("h2", { children: "Upload CSV File" }), _jsx("input", { type: "file", accept: ".csv", onChange: (e) => setFile(e.target.files?.[0] || null) }), _jsx("button", { onClick: handleUpload, disabled: !file, children: "Upload" }), uploadStatus && _jsx("p", { children: uploadStatus })] }));
};
export default FileUploader;
