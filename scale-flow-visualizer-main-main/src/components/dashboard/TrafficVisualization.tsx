
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

interface TrafficData {
  timestamp: string;
  requests: number;
  latency: number;
}

interface TrafficVisualizationProps {
  data: TrafficData[];
  loading?: boolean;
  metric: 'requests' | 'latency';
  title: string;
  color: string;
}

export const TrafficVisualization: React.FC<TrafficVisualizationProps> = ({
  data,
  loading = false,
  metric,
  title,
  color
}) => {
  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        {loading ? (
          <div className="h-full bg-gray-100 animate-pulse rounded-md"></div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fontSize: 12 }}
                tickFormatter={(timestamp) => {
                  const date = new Date(timestamp);
                  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                formatter={(value) => [
                  metric === 'requests' 
                    ? `${value} req/s` 
                    : `${value} ms`,
                  metric === 'requests' ? 'Request Rate' : 'Latency'
                ]}
                labelFormatter={(timestamp) => {
                  const date = new Date(timestamp);
                  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                }}
              />
              <defs>
                <linearGradient id={`color-${metric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey={metric} 
                stroke={color} 
                fillOpacity={1}
                fill={`url(#color-${metric})`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
