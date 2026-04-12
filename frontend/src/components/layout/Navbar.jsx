import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Share2, Network, Box } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home size={22} /> },
    { path: '/persons', label: 'Individuos', icon: <Users size={22} /> },
    { path: '/relationships', label: 'Conexiones', icon: <Share2 size={22} /> },
    { path: '/network-2d', label: 'Mapa 2D', icon: <Network size={22} /> },
    { path: '/network-3d', label: 'Red 3D', icon: <Box size={22} /> },
  ];

  return (
    <nav className="bg-slate-900 text-white h-screen w-72 fixed left-0 top-0 flex flex-col shadow-2xl z-50 border-r border-slate-800">
      <div className="p-10 flex flex-col items-center">
        <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-4">
           <Network size={32} />
        </div>
        <h1 className="text-xl font-black uppercase tracking-[0.2em] text-indigo-500">People</h1>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">Network System</p>
      </div>

      <div className="flex-1 px-6 space-y-2 mt-8">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold group ${
              location.pathname === item.path
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <div className={`${location.pathname === item.path ? 'text-white' : 'text-indigo-500 group-hover:text-indigo-400'} transition-colors`}>
              {item.icon}
            </div>
            <span className="text-sm uppercase tracking-widest">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="p-10 border-t border-slate-800">
        <div className="flex items-center space-x-3 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node Status: <span className="text-slate-200">Active</span></p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
