import React, { useState, useEffect } from 'react';
import { X, Save, History, Trash2, Star, Clock } from 'lucide-react';
import { updateRelationship } from '../../api/relationshipsApi';

const EditRelationshipModal = ({ isOpen, link, onSave, onClose }) => {
  const [formData, setFormData] = useState(null);
  const [logInput, setLogInput] = useState({ fecha: new Date().toISOString().split('T')[0], evento: '', comentario: '' });

  useEffect(() => {
    if (link) {
      setFormData({
        ...link.properties,
        id: link.id,
        tipo_relacion: link.label,
        bitacora: typeof link.properties.bitacora === 'string' ? JSON.parse(link.properties.bitacora) : (link.properties.bitacora || [])
      });
    }
  }, [link]);

  if (!isOpen || !formData) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateRelationship(formData.id, formData);
      onSave();
    } catch (err) {
      alert('Error al actualizar relación');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Editar Vínculo</h3>
           <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><X size={24}/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10 max-h-[80vh] overflow-y-auto scrollbar-hide text-slate-900">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado de la Relación</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['activa', 'finalizada', 'distante', 'conflicto'].map(s => (
                        <button key={s} type="button" onClick={()=>setFormData({...formData, estado: s})} className={`p-3 rounded-xl text-[10px] font-black uppercase transition-all ${formData.estado === s ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nivel de Confianza (1-5)</label>
                    <input type="range" min="1" max="5" value={formData.nivel_confianza} onChange={(e)=>setFormData({...formData, nivel_confianza: parseInt(e.target.value)})} className="w-full h-2 bg-slate-100 rounded-lg appearance-none accent-indigo-600" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <input type="date" value={formData.desde} onChange={(e)=>setFormData({...formData, desde: e.target.value})} className="border-2 border-slate-100 p-4 rounded-2xl font-bold" />
                    <input type="date" value={formData.hasta} onChange={(e)=>setFormData({...formData, hasta: e.target.value})} disabled={formData.estado === 'activa'} className="border-2 border-slate-100 p-4 rounded-2xl font-bold disabled:opacity-30" />
                 </div>
                 <textarea value={formData.descripcion} onChange={(e)=>setFormData({...formData, descripcion: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold h-24" placeholder="Notas..." />
              </div>

              <div className="space-y-6 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-2 text-indigo-600 font-black uppercase text-[10px] tracking-widest"><History size={16}/> <span>Bitácora</span></div>
                     <button type="button" onClick={()=>{
                       if(logInput.evento) { setFormData({...formData, bitacora: [...formData.bitacora, logInput]}); setLogInput({fecha: new Date().toISOString().split('T')[0], evento: '', comentario: ''}); }
                     }} className="bg-indigo-600 text-white px-4 py-1 rounded-lg text-[9px] font-black uppercase shadow-lg">Añadir</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                     <input type="date" value={logInput.fecha} onChange={(e)=>setLogInput({...logInput, fecha: e.target.value})} className="border p-2 rounded-lg text-xs" />
                     <input placeholder="Evento..." value={logInput.evento} onChange={(e)=>setLogInput({...logInput, evento: e.target.value})} className="border p-2 rounded-lg text-xs" />
                  </div>
                  <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-hide">
                    {formData.bitacora.map((l, i) => (
                      <div key={i} className="bg-white p-3 rounded-xl border border-indigo-50 flex justify-between items-center group">
                         <div><p className="text-[9px] font-black text-indigo-400">{l.fecha}</p><p className="text-xs font-bold">{l.evento}</p></div>
                         <button type="button" onClick={()=>{ const n = [...formData.bitacora]; n.splice(i, 1); setFormData({...formData, bitacora: n}); }} className="text-slate-200 hover:text-red-500"><Trash2 size={12}/></button>
                      </div>
                    ))}
                  </div>
              </div>
           </div>

           <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-xl uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-2xl flex items-center justify-center space-x-4">
              <Save size={24}/> <span>Guardar Cambios en el Grafo</span>
           </button>
        </form>
      </div>
    </div>
  );
};

export default EditRelationshipModal;
