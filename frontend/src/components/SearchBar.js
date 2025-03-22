import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import axios from "axios";
const SearchBar = ({ onSearchResults }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            setError("Please enter a valid search term.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://localhost:5000/search", {
                params: { query: searchTerm },
            });
            onSearchResults(response.data.results || []);
        }
        catch (error) {
            console.error("Error fetching search results:", error);
            setError("An error occurred while searching.");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, children: [_jsx("input", { type: "text", placeholder: "Search...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) }), _jsx("button", { type: "submit", disabled: isLoading, children: isLoading ? "Searching..." : "Search" }), error && _jsx("p", { style: { color: "red" }, children: error })] }));
};
export default SearchBar;
