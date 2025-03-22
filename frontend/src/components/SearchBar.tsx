import React, { useState } from "react";
import axios from "axios";
import { UploadedData } from "../types/types";
 
interface SearchBarProps {
  onSearchResults: (results: UploadedData[]) => void;
}
 
const SearchBar: React.FC<SearchBarProps> = ({ onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError("An error occurred while searching.");
    } finally {
      setIsLoading(false);
    }
  };
 
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Searching..." : "Search"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};
 
export default SearchBar;