import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUploader from "./components/FileUploader";
import DataTable from "./components/DataTable";
import SearchBar from "./components/SearchBar";
import Pagination from "./components/Pagination";
import { useDataQuery } from "./hooks/useDataQuery";
 
const App: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, refetch } = useDataQuery(page, searchTerm);
 
  const handleSearchResults = (term: string) => {
    setSearchTerm(term);
    setPage(1); // Reset to the first page on new search
  };
 
  const handleGetData = () => {
    refetch();
    console.log(data);
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
                <DataTable data={data?.data || []} isLoading={isLoading} />
                <Pagination
                  currentPage={page}
                  totalPages={data?.pagination.totalPages || 1}
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