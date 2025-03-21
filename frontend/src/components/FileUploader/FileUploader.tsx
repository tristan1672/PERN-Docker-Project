import { JSX, useState, useRef, ChangeEvent } from 'react';
import axios from 'axios';
import { 
  Button, 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert, 
  Snackbar,
  LinearProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface FileUploaderProps {
  onUploadSuccess: () => void;
}

interface AlertState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

const API_URL = 'http://localhost:5000';

const FileUploader = ({ onUploadSuccess }: FileUploaderProps): JSX.Element => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertState>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (!event.target.files) return;
    
    const selectedFile = event.target.files[0];
    
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setUploadProgress(0);
    } else {
      setAlert({
        open: true,
        message: 'Please select a valid CSV file',
        severity: 'error'
      });
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!file) {
      setAlert({
        open: true,
        message: 'Please select a file first',
        severity: 'error'
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setUploadProgress(0);

    try {
      await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.total 
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(percentCompleted);
        }
      });

      setAlert({
        open: true,
        message: 'File uploaded successfully!',
        severity: 'success'
      });
      
      setFile(null);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      // Call the callback to refresh data
      onUploadSuccess();
      
    } catch (error) {
      console.error('Upload error:', error);
      setAlert({
        open: true,
        message: `Upload failed: ${axios.isAxiosError(error) && error.response?.data?.error 
          ? error.response.data.error 
          : 'Unknown error'}`,
        severity: 'error'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCloseAlert = (): void => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Upload CSV File
        </Typography>
        
        <Box sx={{ 
          border: '2px dashed #cccccc', 
          borderRadius: 2, 
          p: 3, 
          mb: 2, 
          width: '100%',
          textAlign: 'center'
        }}>
          <input
            ref={fileInputRef}
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="csv-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
              disabled={uploading}
            >
              Select CSV File
            </Button>
          </label>
          
          {file && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Selected: {file.name}
            </Typography>
          )}
        </Box>
        
        {uploading && (
          <Box sx={{ width: '100%', mt: 1, mb: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={uploadProgress} 
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
              {uploadProgress}% Uploaded
            </Typography>
          </Box>
        )}
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file || uploading}
          sx={{ minWidth: 150 }}
        >
          {uploading ? <CircularProgress size={24} /> : 'Upload'}
        </Button>
      </Box>
      
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default FileUploader;