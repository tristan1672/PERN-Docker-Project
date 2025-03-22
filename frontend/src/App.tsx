import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUploader from "./components/FileUploader";
import DataTable from "./components/DataTable";
import SearchBar from "./components/SearchBar";
import Pagination from "./components/Pagination";
import { useDataQuery } from "./hooks/useDataQuery";
import { UploadedData } from "./types/types";
 
const App: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchResults, setSearchResults] = useState<UploadedData[] | null>(null);
  const { data, isLoading, refetch } = useDataQuery(page, ""); // Fetch all data initially
 
  const handleSearchResults = (results: UploadedData[]) => {
    setSearchResults(results.length > 0 ? results : null); // If no results, show original data
    setPage(1);
  };
 
  const handleGetData = () => {
    setSearchResults(null); // Reset search
    refetch(); // Fetch all data
  };
 
  return (
    <Router>
      <div>
        <h1>CSV File Upload and Data Table</h1>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <FileUploader />
                <SearchBar onSearchResults={handleSearchResults} />
                <button onClick={handleGetData}>Get Data</button>
                <DataTable data={searchResults || data?.data || []} isLoading={isLoading} />
                <Pagination
                  currentPage={page}
                  totalPages={searchResults ? 1 : data?.pagination.totalPages || 1}
                  onPageChange={setPage}
                />
              </>
            }
          />
          <Route path="/upload" element={<FileUploader />} />
        </Routes>
      </div>
    </Router>
  );
};
 
export default App;