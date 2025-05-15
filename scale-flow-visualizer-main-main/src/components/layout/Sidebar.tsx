
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Server, 
  Database, 
  ServerCog, 
  Settings, 
  Columns3
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Nodes', icon: Server, path: '/nodes' },
    { name: 'Pods', icon: Columns3, path: '/pods' },
    { name: 'Load Balancing', icon: ServerCog, path: '/load-balancing' },
    { name: 'Database', icon: Database, path: '/database' },
    { name: 'Settings', icon: Settings, path: '/settings' }
  ];

  return (
    <aside 
      className={`bg-k8s-navy text-white transition-all duration-300 shadow-lg ${
        collapsed ? 'w-16' : 'w-64'
      } h-screen flex flex-col`}
      aria-label="Main navigation"
    >
      <div className="p-4 flex items-center justify-center border-b border-white/10">
        {!collapsed ? (
          <h1 className="text-xl font-bold text-white">K8s Flow</h1>
        ) : (
          <span className="text-xl font-bold text-white">K8</span>
        )}
      </div>
      <nav className="mt-6 flex-1 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name}>
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        className={`flex items-center justify-center p-3 rounded-md transition-colors ${
                          isActive 
                            ? 'bg-k8s-blue text-white' 
                            : 'hover:bg-white/10'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-300'}`} />
                        <span className="sr-only">{item.name}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700">
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-md transition-colors ${
                      isActive 
                        ? 'bg-k8s-blue text-white' 
                        : 'hover:bg-white/10 text-gray-300'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-white/10 flex justify-center">
        <div className="text-xs text-gray-400">
          {collapsed ? 'v1.0' : 'K8s Flow Manager v1.0'}
        </div>
      </div>
    </aside>
  );
};
