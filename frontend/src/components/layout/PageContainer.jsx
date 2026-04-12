import React from 'react';
import Navbar from './Navbar';

const PageContainer = ({ children, title }) => {
  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Navbar />
      <main className="flex-1 ml-72 p-12">
        <header className="mb-12 flex justify-between items-center animate-in fade-in slide-in-from-left-4 duration-700">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">{title}</h1>
            <div className="h-1.5 w-16 bg-indigo-600 rounded-full mt-2" />
          </div>
          <div className="flex space-x-4">
             {/* Dynamic slots for actions if needed */}
          </div>
        </header>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PageContainer;
