import React from 'react';

const RecentPersonCard = React.memo(({ person }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-50 group hover:bg-white hover:shadow-lg transition-all">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold uppercase">{person.nombre[0]}</div>
        <div>
          <span className="font-black text-gray-700 block text-sm">{person.nombre} {person.apellido}</span>
          <span className="text-[10px] text-indigo-400 font-black uppercase tracking-tighter">{person.profesion || 'Analista'}</span>
        </div>
      </div>
      <div className="text-[10px] text-gray-300 font-bold">{person.ciudad_residencia || 'SCL'}</div>
    </div>
  );
});

export default RecentPersonCard;
