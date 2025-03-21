import { useState, useEffect } from 'react';

// Styles
const styles = {
  container: {
    width: '100%',
    marginBottom: '16px',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative' as const,
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    transition: 'border-color 0.3s ease',
    outline: 'none',
  },
  inputFocused: {
    borderColor: '#1976d2',
    boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
  },
  searchIcon: {
    position: 'absolute' as const,
    right: '12px',
    color: '#757575',
    width: '18px',
    height: '18px',
  }
};

// Search icon as SVG
const SearchIcon = () => (
  <svg 
    style={styles.searchIcon} 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

interface SearchBarProps {
  onSearch: (value: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Handle input change with debouncing
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [searchTerm, onSearch]);

  return (
    <div style={styles.container}>
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Search data..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            ...styles.input,
            ...(isFocused ? styles.inputFocused : {})
          }}
        />
        <SearchIcon />
      </div>
    </div>
  );
};

export default SearchBar;