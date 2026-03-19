import React from 'react';
import Navbar from './Navbar';

const PageContainer = ({ children, title }) => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Navbar />
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        </header>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[calc(100vh-12rem)]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PageContainer;
