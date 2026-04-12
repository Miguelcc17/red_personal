import React from 'react';
import { X, Share2, Calendar, Star, Clock, Info, ArrowRight, History, Edit2 } from 'lucide-react';

const LinkDetailsPanel = ({ link, onClose, onEdit }) => {
  if (!link) return null;
  const props = link.properties || {};

  let bitacora = [];
  if (props.bitacora) {
    if (typeof props.bitacora === 'string') {
       try { bitacora = JSON.parse(props.bitacora); } catch(e) { bitacora = []; }
    } else {
       bitacora = props.bitacora;
    }
  }

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
          <div className="flex space-x-2">
            {onEdit && (
              <button onClick={() => onEdit(link)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-indigo-100 shadow-sm">
                <Edit2 size={20} />
              </button>
            )}
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide text-slate-900">
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

          {bitacora.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center space-x-2 text-indigo-500 font-black uppercase text-[10px] tracking-widest">
                 <History size={14}/> <span>Bitácora de Eventos</span>
              </div>
              <div className="space-y-6 relative ml-2">
                 <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-indigo-100" />
                 {bitacora.map((log, i) => (
                   <div key={i} className="relative pl-6">
                      <div className="absolute left-[-4px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-600 border-2 border-white shadow-sm" />
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                         <p className="text-[9px] font-black text-indigo-400 uppercase">{log.fecha}</p>
                         <p className="text-xs font-black text-slate-800">{log.evento}</p>
                         {log.comentario && <p className="text-[10px] text-slate-500 italic leading-relaxed">"{log.comentario}"</p>}
                      </div>
                   </div>
                 ))}
              </div>
            </section>
          )}

          <section className="space-y-4">
            <div className="flex items-center space-x-2 text-indigo-500 font-black uppercase text-[10px] tracking-widest">
               <Info size={14}/> <span>Contexto de la Relación</span>
            </div>
            <div className="bg-indigo-600 text-white p-6 rounded-[2rem] shadow-xl shadow-indigo-100 italic leading-relaxed text-sm font-medium">
               "{props.descripcion || 'Sin descripción detallada disponible.'}"
            </div>
          </section>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100">
           <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest text-center">ID: {link.id}</p>
        </div>
      </div>
    </>
  );
};

export default LinkDetailsPanel;
