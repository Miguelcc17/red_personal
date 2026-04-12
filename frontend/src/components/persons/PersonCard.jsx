import React from 'react';
import { Mail, Phone, MapPin, Trash2 } from 'lucide-react';

const PersonCard = ({ person, onDelete }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-2xl hover:shadow-indigo-50 transition-all group relative overflow-hidden text-slate-900">
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110" />

      <div className="flex justify-between items-start mb-6 relative">
        <div>
          <h3 className="text-xl font-black text-slate-900 leading-tight">{person.nombre} {person.apellido}</h3>
          <p className="text-indigo-700 font-bold uppercase tracking-widest text-[10px] mt-1">{person.profesion || 'Analista de Grafo'}</p>
        </div>
        <button
          onClick={() => onDelete(person.id)}
          className="text-slate-300 hover:text-red-500 transition-colors p-1"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="space-y-3 text-xs text-slate-600 font-semibold relative">
        <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
          <Mail size={14} className="text-indigo-500" />
          <span className="truncate">{person.email}</span>
        </div>
        <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
          <Phone size={14} className="text-indigo-500" />
          <span>{person.telefono}</span>
        </div>
        <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
          <MapPin size={14} className="text-indigo-500" />
          <span className="truncate">{person.ciudad_residencia || 'Local'}, {person.pais_residencia || 'Red'}</span>
        </div>
      </div>

      {person.hobbies && person.hobbies.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2 relative">
          {person.hobbies.slice(0, 3).map((h, i) => (
            <span key={i} className="bg-white border border-indigo-200 text-indigo-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm">
              {h.nombre}
            </span>
          ))}
          {person.hobbies.length > 3 && <span className="text-[9px] font-bold text-slate-300 mt-1">+{person.hobbies.length - 3}</span>}
        </div>
      )}
    </div>
  );
};

export default PersonCard;
