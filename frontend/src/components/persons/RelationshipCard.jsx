import React from 'react';
import { ArrowRight, Star, Clock, Edit2, Trash2 } from 'lucide-react';

const RelationshipCard = React.memo(({ rel, p1Name, p2Name, typeLabel, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-2xl hover:border-indigo-50 transition-all group animate-in fade-in duration-500">
      <div className="flex items-center space-x-12">
        <div className="flex -space-x-6 group-hover:-space-x-2 transition-all">
           <div className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center font-black border-4 border-white shadow-xl uppercase">
             {p1Name[0]}
           </div>
           <div className="w-16 h-16 bg-indigo-600 text-white rounded-3xl flex items-center justify-center font-black border-4 border-white shadow-xl uppercase">
             {p2Name[0]}
           </div>
        </div>
        <div className="text-slate-900">
          <div className="flex items-center space-x-4">
            <span className="font-black text-xl tracking-tight">{p1Name}</span>
            <ArrowRight className="text-indigo-200" size={24} />
            <span className="font-black text-xl tracking-tight">{p2Name}</span>
          </div>
          <div className="flex flex-wrap gap-6 mt-4 text-[10px] text-slate-400 font-black uppercase tracking-widest">
            <div className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-2xl text-indigo-700 border border-indigo-100">
              <Star size={14} className="fill-current" />
              <span>{typeLabel} • {rel.nivel_confianza}/5</span>
            </div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-2xl border shadow-sm ${rel.estado === 'activa' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
              <Clock size={14} /> <span>{rel.estado}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex space-x-2">
        <button onClick={() => onEdit(rel)} className="p-5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all rounded-[2rem]">
          <Edit2 size={24}/>
        </button>
        <button onClick={() => onDelete(rel.id)} className="p-5 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all rounded-[2rem]">
          <Trash2 size={24}/>
        </button>
      </div>
    </div>
  );
});

export default RelationshipCard;
