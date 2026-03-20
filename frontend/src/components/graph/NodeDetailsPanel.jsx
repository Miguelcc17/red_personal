import React from 'react';
import { X, User, MapPin, Briefcase, Mail, Phone, Info, Star, Hash, Palette, Scissors, Building } from 'lucide-react';

const NodeDetailsPanel = ({ node, onClose }) => {
  if (!node) return null;
  const props = node.properties;

  return (
    <div className="absolute top-4 right-4 w-96 max-h-[calc(100vh-2rem)] overflow-y-auto bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border border-indigo-50 p-6 z-50 animate-in fade-in slide-in-from-right-4 duration-300 scrollbar-hide">
      <div className="flex justify-between items-start mb-6 sticky top-0 bg-white/50 backdrop-blur-sm py-2">
        <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-200">
          {props.nombre[0]}{props.apellido[0]}
        </div>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 leading-tight">{props.nombre} {props.apellido}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs">{props.profesion}</span>
            {props.signo_zodiacal && (
              <span className="bg-indigo-50 text-indigo-400 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                {props.signo_zodiacal}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-start space-x-2 text-sm text-gray-600">
            <User size={16} className="mt-0.5 text-indigo-400 flex-shrink-0" />
            <span>{props.edad} años, {props.genero || 'N/A'}</span>
          </div>
          <div className="flex items-start space-x-2 text-sm text-gray-600">
            <MapPin size={16} className="mt-0.5 text-indigo-400 flex-shrink-0" />
            <span className="truncate">{props.ciudad}, {props.pais}</span>
          </div>
          <div className="flex items-start space-x-2 text-sm text-gray-600">
            <Mail size={16} className="mt-0.5 text-indigo-400 flex-shrink-0" />
            <span className="truncate">{props.email}</span>
          </div>
          <div className="flex items-start space-x-2 text-sm text-gray-600">
            <Phone size={16} className="mt-0.5 text-indigo-400 flex-shrink-0" />
            <span>{props.telefono}</span>
          </div>
        </div>

        {/* Hobbies Section */}
        {props.hobbies && props.hobbies.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center space-x-2">
              <Star size={12}/> <span>Hobbies & Historial</span>
            </p>
            <div className="space-y-2">
              {props.hobbies.map((h, i) => (
                <div key={i} className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded-lg border border-gray-50">
                  <span className="font-medium text-gray-700">{h.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${h.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                    {h.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work History Section */}
        {props.historial_trabajos && props.historial_trabajos.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center space-x-2">
              <Building size={12}/> <span>Historial de Trabajos</span>
            </p>
            <div className="space-y-3">
              {props.historial_trabajos.map((j, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-indigo-100 ml-1">
                  <p className="text-xs font-bold text-gray-800">{j.company}</p>
                  <p className="text-[10px] text-indigo-500 font-medium">{j.role} | {j.period}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analysis Profile */}
        <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
          {props.colores_favoritos && props.colores_favoritos.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase flex items-center space-x-2">
                <Palette size={12}/> <span>Colores</span>
              </p>
              <div className="flex flex-wrap gap-1">
                {props.colores_favoritos.map((c, i) => (
                  <span key={i} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-medium border border-gray-100">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase flex items-center space-x-2">
              <Scissors size={12}/> <span>Tatuajes</span>
            </p>
            <div className="text-[10px] font-bold text-gray-600">
              {props.tiene_tatuajes ? '✅ SÍ' : '❌ NO'}
            </div>
          </div>
        </div>

        {props.tiene_tatuajes && props.tatuajes_descripcion && (
          <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-50 text-[11px] text-indigo-700 leading-relaxed italic">
            <p className="font-bold uppercase text-[9px] mb-1 opacity-50 flex items-center space-x-1">
              <Info size={10}/> <span>Descripción de tatuajes</span>
            </p>
            "{props.tatuajes_descripcion}"
          </div>
        )}

        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Descripción General</p>
          <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-50 leading-relaxed italic">
            "{props.descripcion}"
          </p>
        </div>

        <div className="pt-4">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Intereses</p>
          <div className="flex flex-wrap gap-2">
            {props.intereses && props.intereses.map((int, i) => (
              <span key={i} className="bg-white border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
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
