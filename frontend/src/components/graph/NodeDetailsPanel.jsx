import React from 'react';
import { X, User, MapPin, Briefcase, Mail, Phone, Info, Star, Hash, Palette, Scissors, Building, GraduationCap, Target, Globe } from 'lucide-react';

const NodeDetailsPanel = ({ node, onClose }) => {
  if (!node) return null;
  const props = node.properties;

  return (
    <div className="absolute top-4 right-4 w-[450px] max-h-[calc(100vh-4rem)] overflow-y-auto bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border border-indigo-50 p-8 z-50 animate-in fade-in slide-in-from-right-8 duration-500 scrollbar-hide">
      <div className="flex justify-between items-start mb-8 sticky top-0 bg-white/50 backdrop-blur-md py-4 z-10 border-b border-indigo-50/50">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-200 uppercase">
            {props.nombre ? props.nombre[0] : '?'}{props.apellido ? props.apellido[0] : '?'}
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 leading-tight">
              {props.nombre_completo || `${props.nombre} ${props.apellido}`}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-indigo-600 font-bold uppercase tracking-widest text-[10px]">{props.profesion || 'Perfil de Grafo'}</span>
              {props.signo_zodiacal && (
                <span className="bg-indigo-50 text-indigo-400 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter">
                  {props.signo_zodiacal}
                </span>
              )}
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors bg-white rounded-xl shadow-sm border border-gray-100">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-8">
        {/* Sección de Identidad Estructural */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 text-indigo-500 font-black uppercase text-[10px] tracking-widest">
             <Hash size={14}/> <span>Estructura de Identidad</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-50 flex items-center space-x-3">
              <User size={16} className="text-indigo-400" />
              <span className="text-xs text-gray-600 font-medium">{props.edad} años, {props.genero || 'No def.'}</span>
            </div>
            <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-50 flex items-center space-x-3">
              <Globe size={16} className="text-indigo-400" />
              <span className="text-xs text-gray-600 font-medium">{props.ciudad_residencia || 'Santiago'}, {props.pais_residencia || 'CL'}</span>
            </div>
          </div>
        </section>

        {/* Perfil Psicológico y Conductual */}
        <section className="space-y-4 pt-4 border-t border-gray-50">
          <div className="flex items-center space-x-2 text-indigo-500 font-black uppercase text-[10px] tracking-widest">
             <Star size={14}/> <span>Análisis Conductual</span>
          </div>
          <div className="space-y-3">
             {props.valores_fundamentales && (
               <div className="space-y-2">
                 <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Valores Fundamentales</p>
                 <div className="flex flex-wrap gap-2">
                   {props.valores_fundamentales.map((v, i) => (
                     <span key={i} className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-bold border border-indigo-100/50 uppercase">
                       {v}
                     </span>
                   ))}
                 </div>
               </div>
             )}

             {props.motivadores && (
               <div className="space-y-2">
                 <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Motivadores Clave</p>
                 <div className="flex flex-wrap gap-2">
                   {props.motivadores.map((v, i) => (
                     <span key={i} className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-[10px] font-bold border border-green-100/50 uppercase">
                       {v}
                     </span>
                   ))}
                 </div>
               </div>
             )}
          </div>
        </section>

        {/* Historiales Dinámicos (Work/Edu) */}
        {(props.historial_trabajos?.length > 0 || props.educacion?.length > 0) && (
          <section className="space-y-4 pt-4 border-t border-gray-50">
            <div className="flex items-center space-x-2 text-indigo-500 font-black uppercase text-[10px] tracking-widest">
               <Building size={14}/> <span>Trayectoria Temporal</span>
            </div>
            <div className="space-y-4">
              {props.historial_trabajos?.map((j, i) => (
                <div key={i} className="relative pl-6 border-l-2 border-indigo-100">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-indigo-400" />
                  <p className="text-xs font-black text-gray-800 uppercase leading-none">{j.cargo}</p>
                  <p className="text-[10px] text-indigo-500 font-bold mt-1 uppercase tracking-tighter">{j.empresa} <span className="text-gray-300 mx-1">|</span> {j.desde} - {j.hasta || 'Actual'}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="pt-8 border-t border-gray-50">
           <div className="bg-indigo-600 text-white p-6 rounded-3xl shadow-xl shadow-indigo-100 flex flex-col items-center text-center space-y-2">
              <Info size={24} className="opacity-50" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Visión a Largo Plazo</p>
              <p className="text-sm font-medium italic leading-relaxed">
                 "{props.vision_largo_plazo || 'Sin visión definida'}"
              </p>
           </div>
        </div>

        <div className="pt-4 text-center">
          <p className="text-[9px] text-gray-300 font-medium">Actualizado: {new Date(props.updated_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default NodeDetailsPanel;
