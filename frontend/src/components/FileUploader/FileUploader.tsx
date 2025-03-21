import { JSX } from 'react';

interface FileUploaderProps {
  onUploadSuccess: () => void;
}

function FileUploader({ onUploadSuccess }: FileUploaderProps): JSX.Element {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate file upload logic
      console.log('File uploaded:', file.name);
      onUploadSuccess(); // Trigger success callback
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
    </div>
  );
}

export default FileUploader;