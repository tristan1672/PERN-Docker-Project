import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };
    return (_jsxs("form", { onSubmit: handleSubmit, children: [_jsx("input", { type: "text", placeholder: "Search...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) }), _jsx("button", { type: "submit", children: "Search" })] }));
};
export default SearchBar;
