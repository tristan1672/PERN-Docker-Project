import { JSX, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import FileUploader from './components/FileUploader/FileUploader';
import DataTable from './components/DataTable/DataTable';

// Create a client for React Query
const queryClient = new QueryClient();

// CSS styles as an object
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 16px',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  header: {
    marginTop: '32px',
    marginBottom: '32px',
  },
  title: {
    fontSize: '2.125rem',
    fontWeight: 400,
    textAlign: 'center',
    marginBottom: '24px',
    color: '#333',
  },
  mainContent: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
};

function App(): JSX.Element {
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Handle successful file upload
  const handleUploadSuccess = (): void => {
    // Trigger a refetch of the data
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>CSV Data Uploader</h1>

            <div style={styles.mainContent}>
              {/* File Uploader Component */}
              <FileUploader onUploadSuccess={handleUploadSuccess} />

              {/* Data Table Component */}
              <DataTable refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;