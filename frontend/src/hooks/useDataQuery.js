import { useQuery } from 'react-query'; // Updated import
import axios from 'axios';
const fetchData = async (page, searchTerm = '') => {
    const { data } = await axios.get('http://localhost:5000/data', {
        params: { page, search: searchTerm },
    });
    return data;
};
export const useDataQuery = (page, searchTerm) => {
    const queryOptions = {
        queryKey: ['data', page, searchTerm],
        queryFn: () => fetchData(page, searchTerm),
        keepPreviousData: true, // Retain previous data during refetching (v3 equivalent of placeholderData)
    };
    return useQuery(queryOptions);
};
