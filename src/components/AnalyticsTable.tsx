import { FC } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface AnalyticsTableProps {
  data: Array<Record<string, string | number>>;
}

export const AnalyticsTable: FC<AnalyticsTableProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-muted-foreground">No data to display</div>;
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column} className="font-semibold">
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column}>
                  {row[column]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};