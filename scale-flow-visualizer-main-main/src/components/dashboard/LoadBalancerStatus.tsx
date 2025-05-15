
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface IngressRule {
  host: string;
  path: string;
  serviceName: string;
  servicePort: number;
}

interface LoadBalancerStatusProps {
  name: string;
  namespace: string;
  type: string;
  status: 'Active' | 'Degraded' | 'Failed';
  activeConnections: number;
  rules: IngressRule[];
  loading?: boolean;
}

export const LoadBalancerStatus: React.FC<LoadBalancerStatusProps> = ({
  name,
  namespace,
  type,
  status,
  activeConnections,
  rules,
  loading = false
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-k8s-success/20 text-k8s-success border-k8s-success';
      case 'Degraded':
        return 'bg-k8s-warning/20 text-k8s-warning border-k8s-warning';
      case 'Failed':
        return 'bg-k8s-error/20 text-k8s-error border-k8s-error';
      default:
        return 'bg-gray-100 text-gray-500 border-gray-300';
    }
  };

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Load Balancer</CardTitle>
          <Badge className={`${getStatusColor(status)}`}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Name</div>
                <div className="font-medium">{name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Namespace</div>
                <div className="font-medium">{namespace}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Type</div>
                <div className="font-medium">{type}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Active Connections</div>
                <div className="font-medium">{activeConnections}</div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <div className="text-sm font-medium mb-2">Ingress Rules</div>
              <div className="rounded-md border overflow-hidden">
                <table className="min-w-full divide-y">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Host</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Path</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rules.map((rule, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 text-sm text-gray-900">{rule.host}</td>
                        <td className="px-3 py-2 text-sm text-gray-900">{rule.path}</td>
                        <td className="px-3 py-2 text-sm text-gray-900">
                          {rule.serviceName}:{rule.servicePort}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
