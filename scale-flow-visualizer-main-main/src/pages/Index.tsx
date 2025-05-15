
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { ClusterStatus } from '@/components/dashboard/ClusterStatus';
import { AutoscalingControl } from '@/components/dashboard/AutoscalingControl';
import { LoadBalancerStatus } from '@/components/dashboard/LoadBalancerStatus';
import { NodesList } from '@/components/dashboard/NodesList';
import { TrafficVisualization } from '@/components/dashboard/TrafficVisualization';
import { Server, Database, Monitor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  getClusterOverview, 
  getDeployments, 
  getLoadBalancers, 
  getNodes, 
  getTrafficData,
  updateAutoScalingSettings,
  ClusterOverview,
  DeploymentInfo,
  LoadBalancerInfo,
  NodeInfo,
  TrafficData
} from '@/services/kubernetes-service';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [clusterOverview, setClusterOverview] = useState<ClusterOverview | null>(null);
  const [nodes, setNodes] = useState<NodeInfo[]>([]);
  const [deployments, setDeployments] = useState<DeploymentInfo[]>([]);
  const [loadBalancers, setLoadBalancers] = useState<LoadBalancerInfo[]>([]);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [overview, nodesList, deploymentsList, lbList, traffic] = await Promise.all([
          getClusterOverview(),
          getNodes(),
          getDeployments(),
          getLoadBalancers(),
          getTrafficData()
        ]);
        
        setClusterOverview(overview);
        setNodes(nodesList);
        setDeployments(deploymentsList);
        setLoadBalancers(lbList);
        setTrafficData(traffic);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Set up polling for real-time updates
  useEffect(() => {
    if (loading) return;
    
    const interval = setInterval(async () => {
      try {
        const [overview, nodesList, traffic] = await Promise.all([
          getClusterOverview(),
          getNodes(),
          getTrafficData()
        ]);
        
        setClusterOverview(overview);
        setNodes(nodesList);
        setTrafficData(traffic);
      } catch (error) {
        console.error('Error updating data:', error);
      }
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, [loading]);

  // Handle autoscaling settings update
  const handleAutoscalingUpdate = async (settings: {
    minReplicas: number;
    maxReplicas: number;
    cpuThreshold: number;
    autoScalingEnabled: boolean;
  }) => {
    if (!deployments.length) return;
    
    try {
      const updatedDeployment = await updateAutoScalingSettings(
        deployments[0].name,
        settings
      );
      
      setDeployments(current => 
        current.map(d => 
          d.name === updatedDeployment.name ? updatedDeployment : d
        )
      );
    } catch (error) {
      console.error('Error updating autoscaling settings:', error);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Kubernetes Flow Manager</h1>
        
        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricsCard
            title="CPU Utilization"
            value={clusterOverview?.cpuUsage || 0}
            unit="%"
            icon={<Server className="h-4 w-4" />}
            progress={clusterOverview?.cpuUsage}
            status={
              (clusterOverview?.cpuUsage || 0) > 90
                ? 'error'
                : (clusterOverview?.cpuUsage || 0) > 70
                ? 'warning'
                : 'success'
            }
            loading={loading}
          />
          <MetricsCard
            title="Memory Utilization"
            value={clusterOverview?.memoryUsage || 0}
            unit="%"
            icon={<Database className="h-4 w-4" />}
            progress={clusterOverview?.memoryUsage}
            status={
              (clusterOverview?.memoryUsage || 0) > 90
                ? 'error'
                : (clusterOverview?.memoryUsage || 0) > 70
                ? 'warning'
                : 'success'
            }
            loading={loading}
          />
          <MetricsCard
            title="Storage Utilization"
            value={clusterOverview?.storageUsage || 0}
            unit="%"
            icon={<Database className="h-4 w-4" />}
            progress={clusterOverview?.storageUsage}
            status={
              (clusterOverview?.storageUsage || 0) > 90
                ? 'error'
                : (clusterOverview?.storageUsage || 0) > 70
                ? 'warning'
                : 'success'
            }
            loading={loading}
          />
          <MetricsCard
            title="Pod Status"
            value={clusterOverview?.podsRunning || 0}
            unit={`/ ${clusterOverview?.podsTotal || 0}`}
            icon={<Monitor className="h-4 w-4" />}
            status={
              (clusterOverview?.podsRunning === clusterOverview?.podsTotal)
                ? 'success'
                : (clusterOverview?.podsFailed || 0) > 0
                ? 'error'
                : 'warning'
            }
            loading={loading}
          />
        </div>
        
        {/* Status Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ClusterStatus
            nodesTotal={clusterOverview?.nodesTotal || 0}
            nodesHealthy={clusterOverview?.nodesHealthy || 0}
            podsTotal={clusterOverview?.podsTotal || 0}
            podsRunning={clusterOverview?.podsRunning || 0}
            podsPending={clusterOverview?.podsPending || 0}
            podsFailed={clusterOverview?.podsFailed || 0}
            loading={loading}
          />
          
          <AutoscalingControl
            deployment={deployments[0]?.name || 'frontend'}
            minReplicas={deployments[0]?.autoScaling.minReplicas || 2}
            maxReplicas={deployments[0]?.autoScaling.maxReplicas || 5}
            currentReplicas={deployments[0]?.replicas || 3}
            cpuThreshold={deployments[0]?.autoScaling.cpuThreshold || 75}
            autoScalingEnabled={deployments[0]?.autoScaling.enabled || true}
            onApply={handleAutoscalingUpdate}
          />
        </div>
        
        {/* Traffic Metrics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrafficVisualization
            data={trafficData}
            metric="requests"
            title="Request Rate"
            color="#326CE5"
            loading={loading}
          />
          
          <TrafficVisualization
            data={trafficData}
            metric="latency"
            title="Response Latency"
            color="#00C4B4"
            loading={loading}
          />
        </div>
        
        {/* Additional Data Row */}
        <div className="grid grid-cols-1 gap-6">
          <LoadBalancerStatus
            name={loadBalancers[0]?.name || 'nginx-ingress'}
            namespace={loadBalancers[0]?.namespace || 'default'}
            type={loadBalancers[0]?.type || 'NGINX Ingress Controller'}
            status={loadBalancers[0]?.status || 'Active'}
            activeConnections={loadBalancers[0]?.activeConnections || 0}
            rules={loadBalancers[0]?.rules || []}
            loading={loading}
          />
          
          <NodesList
            nodes={nodes}
            loading={loading}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
