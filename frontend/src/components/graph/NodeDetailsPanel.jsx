import React from 'react';
import { X, User, MapPin, Target, Star, Hash, Building, Globe, Info } from 'lucide-react';

const NodeDetailsPanel = ({ node, onClose }) => {
  if (!node) return null;
  const props = node.properties || {};
  const group = node.group || 'Entidad';

  return (
    <>
      <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-[2px] z-40 transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-[450px] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-50 animate-in slide-in-from-right duration-500 ease-out flex flex-col border-l border-slate-100">

        <div className="p-8 pb-6 border-b border-slate-50 flex justify-between items-start">
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-100 uppercase">
              {props.nombre ? props.nombre[0] : (props.nombre_completo ? props.nombre_completo[0] : group[0])}
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 leading-tight">
                {props.nombre_completo || (props.nombre ? `${props.nombre} ${props.apellido || ''}` : group)}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-indigo-600 font-bold uppercase tracking-widest text-[10px] bg-indigo-50 px-2 py-0.5 rounded-md">{group}</span>
                {props.signo_zodiacal && (
                  <span className="text-slate-400 font-bold uppercase text-[9px] tracking-tighter">
                    • {props.signo_zodiacal}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
          {group === 'Person' ? (
            <>
              <section className="space-y-4">
                <div className="flex items-center space-x-2 text-indigo-500 font-black uppercase text-[10px] tracking-widest">
                   <Hash size={14}/> <span>Identidad Analítica</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Edad / Género</span>
                    <span className="text-xs text-slate-700 font-black">{props.edad || '??'} años, {props.genero || 'No def.'}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Ubicación</span>
                    <span className="text-xs text-slate-700 font-black truncate">{props.ciudad_residencia || props.ciudad || 'Local'}</span>
                  </div>
                </div>
              </section>

              {props.valores_fundamentales && props.valores_fundamentales.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center space-x-2 text-indigo-500 font-black uppercase text-[10px] tracking-widest">
                     <Star size={14}/> <span>Valores y Motivadores</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {props.valores_fundamentales.map((v, i) => (
                       <span key={i} className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black border border-indigo-100 shadow-sm uppercase">{v}</span>
                     ))}
                  </div>
                </section>
              )}

              {props.vision_largo_plazo && (
                <section className="space-y-4">
                  <div className="flex items-center space-x-2 text-indigo-500 font-black uppercase text-[10px] tracking-widest">
                     <Target size={14}/> <span>Visión Estratégica</span>
                  </div>
                  <div className="bg-indigo-600 text-white p-6 rounded-[2rem] shadow-xl shadow-indigo-100 italic leading-relaxed text-sm font-medium">
                     "{props.vision_largo_plazo}"
                  </div>
                </section>
              )}
            </>
          ) : (
            <section className="space-y-4">
              <div className="flex items-center space-x-2 text-indigo-500 font-black uppercase text-[10px] tracking-widest">
                 <Info size={14}/> <span>Metadatos del Nodo</span>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
                {Object.entries(props).map(([key, value]) => {
                  if (['id', 'created_at', 'updated_at'].includes(key)) return null;
                  return (
                    <div key={key} className="flex justify-between items-center text-xs pb-2 border-b border-slate-200 last:border-0 last:pb-0">
                      <span className="font-bold text-slate-400 uppercase text-[9px] tracking-tighter">{key}</span>
                      <span className="text-slate-700 font-black truncate max-w-[200px]">{String(value)}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100">
           <div className="flex items-center justify-between">
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Node ID: {node.id}</p>
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
           </div>
        </div>
      </div>
    </>
  );
};

export default NodeDetailsPanel;
