
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface MetricsCardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon?: React.ReactNode;
  progress?: number;
  status?: 'success' | 'warning' | 'error';
  loading?: boolean;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  unit,
  icon,
  progress,
  status = 'success',
  loading = false
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'bg-k8s-success/20 text-k8s-success';
      case 'warning':
        return 'bg-k8s-warning/20 text-k8s-warning';
      case 'error':
        return 'bg-k8s-error/20 text-k8s-error';
      default:
        return 'bg-k8s-blue/20 text-k8s-blue';
    }
  };

  const getProgressColor = () => {
    if (progress === undefined) return '';
    
    return progress > 90
      ? 'bg-k8s-error'
      : progress > 70
      ? 'bg-k8s-warning'
      : 'bg-k8s-success';
  };

  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        {icon && <div className={`rounded-full p-2 ${getStatusColor()}`}>{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold flex items-baseline">
          {loading ? (
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <>
              {value}
              {unit && <span className="text-gray-500 text-sm ml-1">{unit}</span>}
            </>
          )}
        </div>
        {progress !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Utilization</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress
              value={progress}
              className={`h-2 ${getProgressColor()}`}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
