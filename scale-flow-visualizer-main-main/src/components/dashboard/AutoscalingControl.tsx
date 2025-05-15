
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface AutoscalingControlProps {
  deployment: string;
  minReplicas: number;
  maxReplicas: number;
  currentReplicas: number;
  cpuThreshold: number;
  autoScalingEnabled: boolean;
  onApply: (settings: AutoscalingSettings) => void;
}

interface AutoscalingSettings {
  minReplicas: number;
  maxReplicas: number;
  cpuThreshold: number;
  autoScalingEnabled: boolean;
}

export const AutoscalingControl: React.FC<AutoscalingControlProps> = ({
  deployment,
  minReplicas: initialMinReplicas,
  maxReplicas: initialMaxReplicas,
  currentReplicas,
  cpuThreshold: initialCpuThreshold,
  autoScalingEnabled: initialAutoScalingEnabled,
  onApply
}) => {
  const [minReplicas, setMinReplicas] = useState(initialMinReplicas);
  const [maxReplicas, setMaxReplicas] = useState(initialMaxReplicas);
  const [cpuThreshold, setCpuThreshold] = useState(initialCpuThreshold);
  const [autoScalingEnabled, setAutoScalingEnabled] = useState(initialAutoScalingEnabled);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleApply = () => {
    onApply({
      minReplicas,
      maxReplicas,
      cpuThreshold,
      autoScalingEnabled
    });
    setIsEditing(false);
  };
  
  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Autoscaling: {deployment}</CardTitle>
          <div className="flex items-center space-x-2">
            <Label htmlFor="autoscaling" className="text-sm">Autoscaling</Label>
            <Switch 
              id="autoscaling" 
              checked={autoScalingEnabled}
              onCheckedChange={setAutoScalingEnabled}
              disabled={!isEditing}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="current-replicas">Current Replicas</Label>
            <div className="text-2xl font-bold text-k8s-blue">{currentReplicas}</div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="min-replicas">Min Replicas</Label>
            {isEditing ? (
              <Input 
                id="min-replicas"
                type="number" 
                value={minReplicas}
                onChange={(e) => setMinReplicas(Number(e.target.value))}
                className="h-10"
                min={1}
                max={maxReplicas}
              />
            ) : (
              <div className="text-2xl font-bold">{minReplicas}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-replicas">Max Replicas</Label>
            {isEditing ? (
              <Input 
                id="max-replicas"
                type="number" 
                value={maxReplicas}
                onChange={(e) => setMaxReplicas(Number(e.target.value))}
                className="h-10"
                min={minReplicas}
              />
            ) : (
              <div className="text-2xl font-bold">{maxReplicas}</div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <Label>CPU Threshold</Label>
            <span className="text-sm font-medium">{cpuThreshold}%</span>
          </div>
          <Slider
            value={[cpuThreshold]}
            min={1}
            max={100}
            step={1}
            disabled={!isEditing || !autoScalingEnabled}
            onValueChange={(value) => setCpuThreshold(value[0])}
            className={autoScalingEnabled ? '' : 'opacity-50'}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleApply}>Apply</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
