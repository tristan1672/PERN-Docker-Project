import { JSX, useState } from 'react';
import { useQuery } from 'react-query';
import { QueryFunctionContext } from 'react-query';

import axios from 'axios';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Box,
  CircularProgress,
  Chip
} from '@mui/material';

interface DataTableProps {
  searchTerm: string;
  refreshTrigger: number;
}

interface DataItem {
  id: number;
  post_id: number;
  name: string;
  email: string;
  body: string;
  created_at: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface DataResponse {
  data: DataItem[];
  pagination: Pagination;
}

const API_URL = 'http://localhost:5000';

const DataTable = ({ searchTerm, refreshTrigger }: DataTableProps): JSX.Element => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  // Function to fetch data from the API
  const fetchData = async (context: QueryFunctionContext): Promise<DataResponse> => {
    const [_key, _page, _limit, _search] = context.queryKey as (string | number)[];
    
    try {
      // Convert to 1-based pagination for the backend
      const response = await axios.get(`${API_URL}/api/data`, {
        params: {
          page: Number(_page) + 1, // Backend uses 1-based pagination
          limit: Number(_limit),
          search: String(_search)
        }
      });
      return response.data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw new Error('Failed to fetch data');
    }
  };

  // Using React Query to fetch and cache data
  const { data, isLoading, isError, error } = useQuery<DataResponse, Error>(
    ['data', page, rowsPerPage, searchTerm, refreshTrigger],
    fetchData,
    {
      keepPreviousData: true,
      staleTime: 5000,
    }
  );

  // Handle page change
  const handleChangePage = (_event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Function to truncate long text
  const truncateText = (text: string, maxLength: number = 100): string => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  // Function to format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  // If loading, show a loading indicator
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // If error, show error message
  if (isError) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography color="error">
          Error loading data: {error.message}
        </Typography>
      </Box>
    );
  }

  // If no data or empty data array
  if (!data || !data.data || data.data.length === 0) {
    return (
      <Paper sx={{ p: 3, mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">No data available</Typography>
        <Typography variant="body2" color="textSecondary">
          Upload a CSV file to see data here
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', mt: 4 }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="data table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Post ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Body</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.post_id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.email} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}
                  />
                </TableCell>
                <TableCell>{truncateText(row.body)}</TableCell>
                <TableCell>{formatDate(row.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.pagination.total || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default DataTable;