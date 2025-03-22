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
    const [searchTerm, setSearchTerm] = useState("");
    const { data, isLoading, refetch } = useDataQuery(page, searchTerm);
    const handleSearch = (term) => {
        setSearchTerm(term);
        setPage(1); // Reset to the first page on new search
    };
    const handleGetData = () => {
        refetch();
        console.log(data);
    };
    return (_jsx(Router, { children: _jsxs("div", { children: [_jsx("h1", { children: "CSV File Upload and Data Table" }), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsxs(_Fragment, { children: [_jsx(FileUploader, {}), _jsx(SearchBar, { onSearch: handleSearch }), _jsx("button", { onClick: handleGetData, children: "Get Data" }), _jsx(DataTable, { data: data?.data || [], isLoading: isLoading }), _jsx(Pagination, { currentPage: page, totalPages: data?.pagination.totalPages || 1, onPageChange: setPage })] }) }), _jsx(Route, { path: "/upload", element: _jsx(FileUploader, {}) })] })] }) }));
};
export default App;
