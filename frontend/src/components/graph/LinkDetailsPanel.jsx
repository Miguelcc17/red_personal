import React from 'react';
import { X, Share2, Calendar, Star, Clock, Info, ArrowRight } from 'lucide-react';

const LinkDetailsPanel = ({ link, onClose, getPersonName }) => {
  if (!link) return null;
  const props = link.properties || {};

  return (
    <>
      <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-[2px] z-40 transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-[450px] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-50 animate-in slide-in-from-right duration-500 ease-out flex flex-col border-l border-slate-100">

        <div className="p-8 pb-6 border-b border-slate-50 flex justify-between items-start">
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100">
              <Share2 size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 leading-tight">Detalles del Vínculo</h3>
              <p className="text-indigo-600 font-bold uppercase tracking-widest text-[10px] mt-1 bg-indigo-50 px-2 py-0.5 rounded-md inline-block">
                {link.label}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
          {/* Visual Connection */}
          <section className="space-y-4">
            <div className="flex items-center justify-center space-x-6 bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 shadow-inner">
               <div className="text-center space-y-1">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black mx-auto shadow-lg">?</div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Origen</p>
               </div>
               <ArrowRight className="text-indigo-200" size={24} />
               <div className="text-center space-y-1">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black mx-auto shadow-lg">?</div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Destino</p>
               </div>
            </div>
            <p className="text-[10px] text-center text-slate-400 font-medium italic">Nota: Las identidades están vinculadas en el grafo base.</p>
          </section>

          {/* Analysis Section */}
          <section className="space-y-6">
            <div className="flex items-center space-x-2 text-indigo-500 font-black uppercase text-[10px] tracking-widest">
               <Star size={14}/> <span>Análisis de Vínculo</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Confianza</span>
                <div className="flex items-center space-x-2">
                   <Star className="text-yellow-500 fill-current" size={14} />
                   <span className="text-xs text-slate-700 font-black">{props.nivel_confianza || '3'}/5</span>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Estado</span>
                <div className="flex items-center space-x-2">
                   <Clock className={props.estado === 'activa' ? 'text-green-500' : 'text-slate-400'} size={14} />
                   <span className="text-xs text-slate-700 font-black uppercase tracking-tighter">{props.estado || 'Activa'}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-1">
                   <Calendar size={10} /> <span>Trayectoria Temporal</span>
                </span>
                <span className="text-xs text-slate-700 font-black mt-1">
                   Desde {props.desde || 'N/A'} {props.hasta ? `hasta ${props.hasta}` : '(Actualidad)'}
                </span>
            </div>
          </section>

          {/* Description Section */}
          <section className="space-y-4">
            <div className="flex items-center space-x-2 text-indigo-500 font-black uppercase text-[10px] tracking-widest">
               <Info size={14}/> <span>Descripción del Contexto</span>
            </div>
            <div className="bg-indigo-50 p-6 rounded-[2rem] shadow-xl shadow-indigo-100 italic leading-relaxed text-sm font-medium text-indigo-700 border border-indigo-100">
               "{props.descripcion || 'Sin descripción detallada disponible en el grafo.'}"
            </div>
          </section>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100">
           <div className="flex items-center justify-between">
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Link ID: {link.id}</p>
              <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-pulse" />
           </div>
        </div>
      </div>
    </>
  );
};

export default LinkDetailsPanel;
