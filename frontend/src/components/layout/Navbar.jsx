import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Share2, Network, Box } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/persons', label: 'Persons', icon: <Users size={20} /> },
    { path: '/relationships', label: 'Relationships', icon: <Share2 size={20} /> },
    { path: '/network-2d', label: 'Network 2D', icon: <Network size={20} /> },
    { path: '/network-3d', label: 'Network 3D', icon: <Box size={20} /> },
  ];

  return (
    <nav className="bg-indigo-600 text-white h-screen w-64 fixed left-0 top-0 flex flex-col shadow-lg">
      <div className="p-6 text-2xl font-bold border-b border-indigo-500">
        People Network
      </div>
      <div className="flex-1 py-6">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-6 py-3 transition-colors ${
              location.pathname === item.path ? 'bg-indigo-700' : 'hover:bg-indigo-500'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
      <div className="p-6 border-t border-indigo-500 text-sm opacity-75">
        &copy; 2024 Graph Logic
      </div>
    </nav>
  );
};

export default Navbar;
