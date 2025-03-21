import { useState, ChangeEvent, FormEvent } from 'react';
import { 
  Paper, 
  InputBase, 
  IconButton, 
  Divider,
  Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface SearchBarProps {
  onSearch: (value: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleClear = (): void => {
    setSearchTerm('');
    onSearch('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <Paper
      component="form"
      sx={{ 
        p: '2px 4px', 
        display: 'flex', 
        alignItems: 'center', 
        width: '100%',
        maxWidth: 500,
        mx: 'auto'
      }}
      elevation={2}
      onSubmit={handleSubmit}
    >
      <Box sx={{ p: '10px' }}>
        <SearchIcon color="action" />
      </Box>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search by name, email or content..."
        value={searchTerm}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'search data' }}
      />
      {searchTerm && (
        <>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton 
            sx={{ p: '10px' }} 
            aria-label="clear search" 
            onClick={handleClear}
          >
            <ClearIcon />
          </IconButton>
        </>
      )}
    </Paper>
  );
};

export default SearchBar;