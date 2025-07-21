import React from 'react';

const ChartView: React.FC<{ data: any }> = ({ data }) => (
  <div>
    <strong>Chart:</strong> {JSON.stringify(data)}
    {/* Replace with real chart rendering (e.g., Chart.js, Recharts) */}
  </div>
);

export default ChartView; 