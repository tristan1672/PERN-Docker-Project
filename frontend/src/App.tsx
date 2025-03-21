import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Container, CssBaseline, Typography, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import FileUploader from './components/FileUploader/FileUploader';
import DataTable from './components/DataTable/DataTable';
import SearchBar from './components/SearchBar/SearchBar';

// Create a client for React Query
const queryClient = new QueryClient();

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Handle successful file upload
  const handleUploadSuccess = (): void => {
    // Trigger a refetch of the data
    setRefreshTrigger(prev => prev + 1);
  };

  // Handle search input change
  const handleSearch = (value: string): void => {
    setSearchTerm(value);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="lg">
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              CSV Data Uploader
            </Typography>
            
            <FileUploader onUploadSuccess={handleUploadSuccess} />
            
            <Box sx={{ mt: 3, mb: 2 }}>
              <SearchBar onSearch={handleSearch} />
            </Box>
            
            <DataTable 
              searchTerm={searchTerm} 
              refreshTrigger={refreshTrigger}
            />
          </Box>
        </Container>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;