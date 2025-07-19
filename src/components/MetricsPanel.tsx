import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Calendar } from 'lucide-react';

interface Metric {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

interface MetricsPanelProps {
  className?: string;
}

export const MetricsPanel: FC<MetricsPanelProps> = ({ className = '' }) => {
  const metrics: Metric[] = [
    {
      label: 'Total Revenue',
      value: '$1.2M',
      change: 12.5,
      trend: 'up',
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      label: 'Active Customers',
      value: '2,847',
      change: -2.3,
      trend: 'down',
      icon: <Users className="h-4 w-4" />
    },
    {
      label: 'Conversion Rate',
      value: '23.4%',
      change: 5.7,
      trend: 'up',
      icon: <Target className="h-4 w-4" />
    },
    {
      label: 'Monthly Growth',
      value: '8.2%',
      change: 1.4,
      trend: 'up',
      icon: <Calendar className="h-4 w-4" />
    }
  ];

  const salesPipeline = [
    { stage: 'Leads', count: 145, percentage: 100 },
    { stage: 'Qualified', count: 98, percentage: 68 },
    { stage: 'Proposal', count: 42, percentage: 29 },
    { stage: 'Closed', count: 18, percentage: 12 }
  ];

  const topCustomers = [
    { name: 'Acme Corp', revenue: '$125,000', growth: 15.2 },
    { name: 'TechFlow Inc', revenue: '$98,500', growth: -3.1 },
    { name: 'Global Systems', revenue: '$87,300', growth: 22.8 },
    { name: 'Digital Solutions', revenue: '$76,200', growth: 8.9 }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quick Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Quick Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-muted">
                  {metric.icon}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <p className="text-sm font-medium">{metric.value}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-xs ${
                  metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {Math.abs(metric.change)}%
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sales Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Sales Pipeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {salesPipeline.map((stage, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{stage.stage}</span>
                <span className="font-medium">{stage.count}</span>
              </div>
              <Progress value={stage.percentage} className="h-1" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Top Customers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topCustomers.map((customer, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium">{customer.name}</p>
                <p className="text-xs text-muted-foreground">{customer.revenue}</p>
              </div>
              <Badge 
                variant={customer.growth > 0 ? "default" : "secondary"}
                className="text-xs"
              >
                {customer.growth > 0 ? '+' : ''}{customer.growth}%
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};