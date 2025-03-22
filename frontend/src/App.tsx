import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useDataQuery } from './hooks/useDataQuery';
import DataTable from './components/DataTable';
import SearchBar from './components/SearchBar';
import Pagination from './components/Pagination';
import FileUploader from './components/FileUploader';

const App: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading } = useDataQuery(page, searchTerm);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1); // Reset to the first page on new search
  };

  return (
    <Router>
      <div>
        <h1>CSV File Upload and Data Table</h1>

        {/* Navigation Links */}
        <nav>
          <Link to="/">Data Table</Link> | <Link to="/upload">Upload CSV</Link>
        </nav>

        {/* Routes */}
        <Routes>
          {/* Route for displaying the data table */}
          <Route
            path="/"
            element={
              <>
                <SearchBar onSearch={handleSearch} />
                <DataTable data={data?.results || []} isLoading={isLoading} />
                <Pagination
                  currentPage={page}
                  totalPages={data?.totalPages || 1}
                  onPageChange={setPage}
                />
              </>
            }
          />

          {/* Route for uploading files */}
          <Route path="/upload" element={<FileUploader />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;