
// This is a mock service that simulates Kubernetes API calls
// In a production environment, this would be replaced with real API calls

import { toast } from "sonner";

// Types
export interface ClusterOverview {
  nodesTotal: number;
  nodesHealthy: number;
  podsTotal: number;
  podsRunning: number;
  podsPending: number;
  podsFailed: number;
  cpuUsage: number;
  cpuCapacity: number;
  memoryUsage: number;
  memoryCapacity: number;
  storageUsage: number;
  storageCapacity: number;
}

export interface NodeInfo {
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

export interface DeploymentInfo {
  name: string;
  namespace: string;
  replicas: number;
  availableReplicas: number;
  updatedReplicas: number;
  autoScaling: {
    enabled: boolean;
    minReplicas: number;
    maxReplicas: number;
    cpuThreshold: number;
  };
}

export interface LoadBalancerInfo {
  name: string;
  namespace: string;
  type: string;
  status: 'Active' | 'Degraded' | 'Failed';
  activeConnections: number;
  rules: {
    host: string;
    path: string;
    serviceName: string;
    servicePort: number;
  }[];
}

export interface TrafficData {
  timestamp: string;
  requests: number;
  latency: number;
}

// Mock data
let clusterOverview: ClusterOverview = {
  nodesTotal: 5,
  nodesHealthy: 5,
  podsTotal: 42,
  podsRunning: 38,
  podsPending: 3,
  podsFailed: 1,
  cpuUsage: 62,
  cpuCapacity: 100,
  memoryUsage: 48,
  memoryCapacity: 100,
  storageUsage: 31,
  storageCapacity: 100
};

let nodes: NodeInfo[] = [
  {
    name: 'node-1',
    status: 'Ready',
    role: 'master',
    cpu: { usage: 1.8, capacity: 4 },
    memory: { usage: 3.2, capacity: 8 },
    pods: { running: 12, capacity: 30 }
  },
  {
    name: 'node-2',
    status: 'Ready',
    role: 'worker',
    cpu: { usage: 2.2, capacity: 4 },
    memory: { usage: 4.5, capacity: 8 },
    pods: { running: 18, capacity: 30 }
  },
  {
    name: 'node-3',
    status: 'Ready',
    role: 'worker',
    cpu: { usage: 1.5, capacity: 4 },
    memory: { usage: 2.8, capacity: 8 },
    pods: { running: 8, capacity: 30 }
  },
  {
    name: 'node-4',
    status: 'Ready',
    role: 'worker',
    cpu: { usage: 2.7, capacity: 4 },
    memory: { usage: 5.1, capacity: 8 },
    pods: { running: 14, capacity: 30 }
  },
  {
    name: 'node-5',
    status: 'Ready',
    role: 'worker',
    cpu: { usage: 1.9, capacity: 4 },
    memory: { usage: 3.7, capacity: 8 },
    pods: { running: 10, capacity: 30 }
  }
];

let deployments: DeploymentInfo[] = [
  {
    name: 'frontend',
    namespace: 'default',
    replicas: 3,
    availableReplicas: 3,
    updatedReplicas: 3,
    autoScaling: {
      enabled: true,
      minReplicas: 2,
      maxReplicas: 5,
      cpuThreshold: 75
    }
  },
  {
    name: 'backend-api',
    namespace: 'default',
    replicas: 2,
    availableReplicas: 2,
    updatedReplicas: 2,
    autoScaling: {
      enabled: true,
      minReplicas: 1,
      maxReplicas: 4,
      cpuThreshold: 80
    }
  },
  {
    name: 'database',
    namespace: 'db',
    replicas: 1,
    availableReplicas: 1,
    updatedReplicas: 1,
    autoScaling: {
      enabled: false,
      minReplicas: 1,
      maxReplicas: 1,
      cpuThreshold: 70
    }
  }
];

let loadBalancers: LoadBalancerInfo[] = [
  {
    name: 'nginx-ingress',
    namespace: 'ingress-nginx',
    type: 'NGINX Ingress Controller',
    status: 'Active',
    activeConnections: 234,
    rules: [
      {
        host: 'app.example.com',
        path: '/',
        serviceName: 'frontend',
        servicePort: 80
      },
      {
        host: 'api.example.com',
        path: '/api',
        serviceName: 'backend-api',
        servicePort: 8080
      },
      {
        host: 'admin.example.com',
        path: '/',
        serviceName: 'admin-dashboard',
        servicePort: 80
      }
    ]
  }
];

// Generate traffic data
const generateTrafficData = (hours: number): TrafficData[] => {
  const data: TrafficData[] = [];
  const now = new Date();
  
  for (let i = 0; i < hours * 60; i += 2) {
    const timestamp = new Date(now.getTime() - (hours * 60 - i) * 60 * 1000);
    
    // Generate sine wave pattern with some randomness
    const angle = (i / (hours * 60)) * Math.PI * 4;
    const baseRequests = 100 + Math.sin(angle) * 60;
    const baseLatency = 50 + Math.sin(angle + 2) * 20;
    
    data.push({
      timestamp: timestamp.toISOString(),
      requests: Math.max(10, Math.round(baseRequests + (Math.random() * 20 - 10))),
      latency: Math.max(10, Math.round(baseLatency + (Math.random() * 15 - 7)))
    });
  }
  
  return data;
};

let trafficData: TrafficData[] = generateTrafficData(2); // 2 hours of data

// Service functions
export const getClusterOverview = (): Promise<ClusterOverview> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate some small random changes to make it more realistic
      clusterOverview = {
        ...clusterOverview,
        cpuUsage: Math.min(100, Math.max(10, clusterOverview.cpuUsage + (Math.random() * 6 - 3))),
        memoryUsage: Math.min(100, Math.max(10, clusterOverview.memoryUsage + (Math.random() * 4 - 2)))
      };
      
      resolve(clusterOverview);
    }, 500); // Simulate network latency
  });
};

export const getNodes = (): Promise<NodeInfo[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate random changes in node usage
      nodes = nodes.map(node => ({
        ...node,
        cpu: {
          ...node.cpu,
          usage: Math.min(node.cpu.capacity, Math.max(0.2, node.cpu.usage + (Math.random() * 0.4 - 0.2)))
        },
        memory: {
          ...node.memory,
          usage: Math.min(node.memory.capacity, Math.max(0.5, node.memory.usage + (Math.random() * 0.3 - 0.15)))
        }
      }));
      
      // Occasionally simulate a node going down
      if (Math.random() > 0.95) {
        const nodeIndex = Math.floor(Math.random() * nodes.length);
        nodes[nodeIndex].status = nodes[nodeIndex].status === 'Ready' ? 'NotReady' : 'Ready';
      }
      
      resolve(nodes);
    }, 700);
  });
};

export const getDeployments = (): Promise<DeploymentInfo[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(deployments);
    }, 600);
  });
};

export const getLoadBalancers = (): Promise<LoadBalancerInfo[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Occasionally vary the active connections
      loadBalancers = loadBalancers.map(lb => ({
        ...lb,
        activeConnections: Math.max(0, lb.activeConnections + Math.floor(Math.random() * 40 - 20))
      }));
      
      resolve(loadBalancers);
    }, 800);
  });
};

export const getTrafficData = (): Promise<TrafficData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Add a new data point
      const now = new Date();
      const lastPoint = trafficData[trafficData.length - 1];
      
      const newRequests = Math.max(10, lastPoint.requests + (Math.random() * 20 - 10));
      const newLatency = Math.max(10, lastPoint.latency + (Math.random() * 15 - 7));
      
      trafficData = [
        ...trafficData.slice(1),
        {
          timestamp: now.toISOString(),
          requests: Math.round(newRequests),
          latency: Math.round(newLatency)
        }
      ];
      
      resolve(trafficData);
    }, 500);
  });
};

export const updateAutoScalingSettings = (
  deploymentName: string,
  settings: {
    minReplicas: number;
    maxReplicas: number;
    cpuThreshold: number;
    autoScalingEnabled: boolean;
  }
): Promise<DeploymentInfo> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const deploymentIndex = deployments.findIndex(d => d.name === deploymentName);
      
      if (deploymentIndex === -1) {
        toast.error(`Deployment ${deploymentName} not found`);
        reject(new Error(`Deployment ${deploymentName} not found`));
        return;
      }
      
      // Update the deployment
      deployments[deploymentIndex] = {
        ...deployments[deploymentIndex],
        autoScaling: {
          enabled: settings.autoScalingEnabled,
          minReplicas: settings.minReplicas,
          maxReplicas: settings.maxReplicas,
          cpuThreshold: settings.cpuThreshold
        }
      };
      
      toast.success(`Updated autoscaling settings for ${deploymentName}`);
      resolve(deployments[deploymentIndex]);
    }, 1000);
  });
};
