import React from 'react';
import { X, User, MapPin, Briefcase, Mail, Phone, Info } from 'lucide-react';

const NodeDetailsPanel = ({ node, onClose }) => {
  if (!node) return null;
  const props = node.properties;

  return (
    <div className="absolute top-4 right-4 w-80 bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border border-indigo-50 p-6 z-50 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
          {props.nombre[0]}{props.apellido[0]}
        </div>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 leading-tight">{props.nombre} {props.apellido}</h3>
          <p className="text-indigo-600 font-bold uppercase tracking-wider text-xs mt-1">{props.profesion}</p>
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex items-start space-x-3 text-sm text-gray-600">
            <User size={16} className="mt-0.5 text-indigo-400" />
            <span>{props.edad} years old, {props.genero}</span>
          </div>
          <div className="flex items-start space-x-3 text-sm text-gray-600">
            <MapPin size={16} className="mt-0.5 text-indigo-400" />
            <span>{props.ciudad}, {props.pais}</span>
          </div>
          <div className="flex items-start space-x-3 text-sm text-gray-600">
            <Mail size={16} className="mt-0.5 text-indigo-400" />
            <span className="truncate">{props.email}</span>
          </div>
          <div className="flex items-start space-x-3 text-sm text-gray-600">
            <Phone size={16} className="mt-0.5 text-indigo-400" />
            <span>{props.telefono}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Description</p>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-50 leading-relaxed italic">
            "{props.descripcion}"
          </p>
        </div>

        <div className="pt-4">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Interests</p>
          <div className="flex flex-wrap gap-2">
            {props.intereses && props.intereses.map((int, i) => (
              <span key={i} className="bg-white border border-indigo-100 text-indigo-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase">
                {int}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeDetailsPanel;
