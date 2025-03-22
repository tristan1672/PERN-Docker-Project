import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useDataQuery } from './hooks/useDataQuery';
import DataTable from './components/DataTable';
import SearchBar from './components/SearchBar';
import Pagination from './components/Pagination';
const App = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const { data, isLoading } = useDataQuery(page, searchTerm);
    const handleSearch = (term) => {
        setSearchTerm(term);
        setPage(1); // Reset to the first page on new search
    };
    return (_jsxs("div", { children: [_jsx("h1", { children: "Data Table" }), _jsx(SearchBar, { onSearch: handleSearch }), _jsx(DataTable, { data: data?.results || [], isLoading: isLoading }), _jsx(Pagination, { currentPage: page, totalPages: data?.totalPages || 1, onPageChange: setPage })] }));
};
export default App;
