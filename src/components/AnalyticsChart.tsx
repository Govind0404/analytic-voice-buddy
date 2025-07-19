import { FC } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsChartProps {
  data: Array<{
    name: string;
    value: number;
    label?: string;
    count?: number;
  }>;
}

const COLORS = [
  'hsl(var(--chart-primary))',
  'hsl(var(--chart-secondary))',
  'hsl(var(--chart-tertiary))',
  'hsl(var(--chart-quaternary))',
  'hsl(212 87% 39%)',
  'hsl(16 185 119%)',
];

export const AnalyticsChart: FC<AnalyticsChartProps> = ({ data }) => {
  // Use pie chart for smaller datasets, bar chart for larger ones
  const usePieChart = data.length <= 4;
  
  if (usePieChart) {
    return (
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
          <Tooltip 
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px'
            }}
          />
          <Bar dataKey="value" fill="hsl(var(--chart-primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};