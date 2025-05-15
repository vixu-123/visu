
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NodeInfo {
  name: string;
  status: 'Ready' | 'NotReady';
  role: string;
  cpu: {
    usage: number;
    capacity: number;
  };
  memory: {
    usage: number;
    capacity: number;
  };
  pods: {
    running: number;
    capacity: number;
  };
}

interface NodesListProps {
  nodes: NodeInfo[];
  loading?: boolean;
}

export const NodesList: React.FC<NodesListProps> = ({ nodes, loading = false }) => {
  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Cluster Nodes</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-xs uppercase">
                  <th className="px-3 py-3 text-left">Name</th>
                  <th className="px-3 py-3 text-left">Status</th>
                  <th className="px-3 py-3 text-left">Role</th>
                  <th className="px-3 py-3 text-left">CPU</th>
                  <th className="px-3 py-3 text-left">Memory</th>
                  <th className="px-3 py-3 text-left">Pods</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map((node) => (
                  <tr key={node.name} className="hover:bg-gray-50">
                    <td className="px-3 py-4 text-sm">{node.name}</td>
                    <td className="px-3 py-4">
                      <Badge
                        variant={node.status === 'Ready' ? 'outline' : 'destructive'}
                        className={
                          node.status === 'Ready'
                            ? 'border-k8s-success text-k8s-success'
                            : ''
                        }
                      >
                        {node.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-4 text-sm">{node.role}</td>
                    <td className="px-3 py-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              (node.cpu.usage / node.cpu.capacity) * 100 > 80
                                ? 'bg-k8s-error'
                                : 'bg-k8s-blue'
                            }`}
                            style={{
                              width: `${(node.cpu.usage / node.cpu.capacity) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs">
                          {Math.round((node.cpu.usage / node.cpu.capacity) * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              (node.memory.usage / node.memory.capacity) * 100 > 80
                                ? 'bg-k8s-error'
                                : 'bg-k8s-blue'
                            }`}
                            style={{
                              width: `${(node.memory.usage / node.memory.capacity) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs">
                          {Math.round((node.memory.usage / node.memory.capacity) * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm">
                      {node.pods.running}/{node.pods.capacity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
