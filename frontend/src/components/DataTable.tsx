import React from 'react';
import { UploadedData } from '../types/types';

interface DataTableProps {
  data: UploadedData[];
  isLoading: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ data, isLoading }) => {
  if (isLoading) return <div>Loading...</div>;

  return (
    <table>
      <thead>
        <tr>
          <th>Post ID</th>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Body</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.post_id}</td>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.email}</td>
            <td>{item.body}</td>
            <td>{new Date(item.created_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;