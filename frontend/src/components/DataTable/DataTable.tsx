import { JSX, useEffect, useState } from 'react';

interface TableRow {
  id: number;
  name: string;
  value: string;
}

interface DataTableProps {
  refreshTrigger: number;
}

function DataTable({ refreshTrigger }: DataTableProps): JSX.Element {
  const [data, setData] = useState<TableRow[]>([]);

  useEffect(() => {
    // Simulate data fetching logic
    console.log('Fetching from:', window.location.origin + '/data');
    console.log('Refreshing data...');
    fetch('http://localhost:5000/data')
      .then((response) => response.json())
      .then((data: TableRow[]) => setData(data)) // Explicitly type the response
      .catch((error) => console.error('Error fetching data:', error));
  }, [refreshTrigger]);

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.name}</td>
            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;