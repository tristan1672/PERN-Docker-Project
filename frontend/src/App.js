import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUploader from "./components/FileUploader";
import DataTable from "./components/DataTable";
import SearchBar from "./components/SearchBar";
import Pagination from "./components/Pagination";
import { useDataQuery } from "./hooks/useDataQuery";
const App = () => {
    const [page, setPage] = useState(1);
    const [searchResults, setSearchResults] = useState(null);
    const { data, isLoading, refetch } = useDataQuery(page, ""); // Fetch all data initially
    const handleSearchResults = (results) => {
        setSearchResults(results.length > 0 ? results : null); // If no results, show original data
        setPage(1);
    };
    const handleGetData = () => {
        setSearchResults(null); // Reset search
        refetch(); // Fetch all data
    };
    return (_jsx(Router, { children: _jsxs("div", { children: [_jsx("h1", { children: "CSV File Upload and Data Table" }), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsxs(_Fragment, { children: [_jsx(FileUploader, {}), _jsx(SearchBar, { onSearchResults: handleSearchResults }), _jsx("button", { onClick: handleGetData, children: "Get Data" }), _jsx(DataTable, { data: searchResults || data?.data || [], isLoading: isLoading }), _jsx(Pagination, { currentPage: page, totalPages: searchResults ? 1 : data?.pagination.totalPages || 1, onPageChange: setPage })] }) }), _jsx(Route, { path: "/upload", element: _jsx(FileUploader, {}) })] })] }) }));
};
export default App;
