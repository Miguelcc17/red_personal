import React from 'react';

const StatCard = React.memo(({ stat }) => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-50 shadow-sm flex items-center space-x-6 hover:shadow-xl hover:shadow-indigo-50/50 transition-all group">
      <div className="p-4 bg-gray-50 rounded-2xl group-hover:scale-110 transition-transform">{stat.icon}</div>
      <div>
        <p className="text-xs text-gray-400 font-black uppercase tracking-widest">{stat.label}</p>
        <h4 className="text-3xl font-black text-gray-900 mt-1">{stat.value}</h4>
      </div>
    </div>
  );
});

export default StatCard;
