import React from 'react';

const TableView: React.FC<{ data: any[] }> = ({ data }) => (
  <table border={1}>
    <thead>
      <tr>
        {data.length > 0 && Object.keys(data[0]).map((col) => <th key={String(col)}>{col}</th>)}
      </tr>
    </thead>
    <tbody>
      {data.map((row, idx) => (
        <tr key={idx}>
          {Object.values(row).map((val, i) => <td key={i}>{String(val)}</td>)}
        </tr>
      ))}
    </tbody>
  </table>
);

export default TableView; 