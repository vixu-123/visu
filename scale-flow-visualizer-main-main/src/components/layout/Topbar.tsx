
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Bell,
  User,
  Menu
} from 'lucide-react';

interface TopbarProps {
  toggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({ toggleSidebar, sidebarCollapsed }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="mr-3 text-gray-600 hover:text-k8s-blue hover:bg-k8s-blue/10" 
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <Menu size={20} /> : <ArrowLeft size={20} />}
        </Button>
        <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">Kubernetes Flow Manager</h2>
        <h2 className="text-lg font-semibold text-gray-800 sm:hidden">K8s Flow</h2>
      </div>
      <div className="flex items-center space-x-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-600 hover:text-k8s-blue hover:bg-k8s-blue/10 relative" 
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>
        <div className="h-8 w-8 rounded-full bg-k8s-blue flex items-center justify-center text-white cursor-pointer hover:bg-k8s-navy transition-colors">
          <User size={16} />
        </div>
      </div>
    </header>
  );
};
