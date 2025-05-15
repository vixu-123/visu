
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ClusterStatusProps {
  nodesTotal: number;
  nodesHealthy: number;
  podsTotal: number;
  podsRunning: number;
  podsPending: number;
  podsFailed: number;
  loading?: boolean;
}

export const ClusterStatus: React.FC<ClusterStatusProps> = ({
  nodesTotal,
  nodesHealthy,
  podsTotal,
  podsRunning,
  podsPending,
  podsFailed,
  loading = false
}) => {
  return (
    <Card className="overflow-hidden border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Cluster Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : (
          <>
            <div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Nodes</span>
                <Badge variant={nodesHealthy === nodesTotal ? "success" : "destructive"}>
                  {nodesHealthy}/{nodesTotal} healthy
                </Badge>
              </div>
              <div className="flex mt-2">
                <div className="bg-k8s-success rounded-full h-3" style={{ width: `${(nodesHealthy / nodesTotal) * 100}%` }}></div>
                <div className="bg-k8s-error rounded-full h-3" style={{ width: `${((nodesTotal - nodesHealthy) / nodesTotal) * 100}%` }}></div>
              </div>
            </div>
            <Separator />
            <div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pods</span>
                <div className="text-xs">
                  Total: <span className="font-medium">{podsTotal}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="text-center">
                  <div className="text-xs text-gray-500">Running</div>
                  <div className="text-lg font-medium text-k8s-success">{podsRunning}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Pending</div>
                  <div className="text-lg font-medium text-k8s-warning">{podsPending}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Failed</div>
                  <div className="text-lg font-medium text-k8s-error">{podsFailed}</div>
                </div>
              </div>
              <div className="flex mt-2 rounded-full overflow-hidden">
                <div className="bg-k8s-success h-2" style={{ width: `${(podsRunning / podsTotal) * 100}%` }}></div>
                <div className="bg-k8s-warning h-2" style={{ width: `${(podsPending / podsTotal) * 100}%` }}></div>
                <div className="bg-k8s-error h-2" style={{ width: `${(podsFailed / podsTotal) * 100}%` }}></div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
