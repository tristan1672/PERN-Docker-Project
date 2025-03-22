import { useQuery, UseQueryOptions } from 'react-query'; // Updated import
import axios from 'axios';
import { ApiResponse } from '../types/types';

const fetchData = async (page: number, searchTerm: string = ''): Promise<ApiResponse> => {
  const { data } = await axios.get<ApiResponse>('http://localhost:5000/data', {
    params: { page, search: searchTerm },
  });
  return data;
};

export const useDataQuery = (page: number, searchTerm: string) => {
  const queryOptions: UseQueryOptions<ApiResponse, Error> = {
    queryKey: ['data', page, searchTerm],
    queryFn: () => fetchData(page, searchTerm),
    keepPreviousData: true, // Retain previous data during refetching (v3 equivalent of placeholderData)
  };

  return useQuery<ApiResponse, Error>(queryOptions);
};