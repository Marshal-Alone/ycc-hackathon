import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Package, TrendingUp, DollarSign } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'listings', label: 'Listings', icon: Package },
    { id: 'bookings', label: 'Bookings', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: DollarSign },
  ];

  return (
    <aside className="w-64 bg-white border-r">
      <div className="p-4">
        <h2 className="text-2xl font-bold">Admin Menu</h2>
      </div>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <motion.button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-2 p-4 text-left ${
                  activeTab === item.id ? 'bg-primary text-white' : 'hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </motion.button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
