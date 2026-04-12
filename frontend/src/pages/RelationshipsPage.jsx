import React, { useState, useMemo } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { useRelationships } from '../hooks/useRelationships';
import { usePersons } from '../hooks/usePersons';
import { createRelationship, deleteRelationship } from '../api/relationshipsApi';
import Loader from '../components/common/Loader';
import { Plus, Share2, Trash2, Calendar, Star, ArrowRight, CheckCircle2, User, Search } from 'lucide-react';

const RelationshipsPage = () => {
  const { relationships, loading: rLoading, fetchRelationships } = useRelationships();
  const { persons, loading: pLoading } = usePersons();
  const [step, setStep] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [searchSource, setSearchSource] = useState('');
  const [searchTarget, setSearchTarget] = useState('');

  const [formData, setFormData] = useState({
    p1_id: '', p2_id: '', tipo_relacion: 'amigo',
    descripcion: '', nivel_confianza: 3, desde: new Date().toISOString().split('T')[0]
  });

  const filteredSource = useMemo(() => persons.filter(p => `${p.nombre} ${p.apellido}`.toLowerCase().includes(searchSource.toLowerCase())), [persons, searchSource]);
  const filteredTarget = useMemo(() => persons.filter(p => `${p.nombre} ${p.apellido}`.toLowerCase().includes(searchTarget.toLowerCase())), [persons, searchTarget]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRelationship(formData);
      fetchRelationships();
      resetForm();
    } catch (err) {
      alert('Error al crear relación');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setStep(1);
    setFormData({ p1_id: '', p2_id: '', tipo_relacion: 'amigo', descripcion: '', nivel_confianza: 3, desde: new Date().toISOString().split('T')[0] });
  };

  const getPersonName = (id) => {
    const p = persons.find(per => per.id === id);
    return p ? `${p.nombre} ${p.apellido}` : 'Desconocido';
  };

  if (rLoading || pLoading) return <PageContainer title="Relationships"><Loader /></PageContainer>;

  return (
    <PageContainer title="Red de Conexiones">
      {/* Resumen Didáctico */}
      <div className="bg-indigo-600 rounded-[2.5rem] p-10 mb-12 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">¿Cómo se conectan tus nodos?</h2>
          <p className="text-indigo-100 max-w-2xl leading-relaxed font-medium">
            Las relaciones son el corazón del grafo. No solo unes personas, creas una trayectoria de confianza y colaboración.
            Define quién conoce a quién y bajo qué contexto para desbloquear el poder del análisis de red.
          </p>
        </div>
        <Share2 className="absolute -right-10 -bottom-10 w-64 h-64 text-indigo-500 opacity-20" />
      </div>

      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest flex items-center space-x-3">
           <div className="w-2 h-8 bg-indigo-500 rounded-full" />
           <span>Historial de Vínculos</span>
        </h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-3 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95"
          >
            <Plus size={20} />
            <span>Nueva Conexión</span>
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl mb-16 overflow-hidden animate-in slide-in-from-top-4 duration-500">
          {/* Stepper Header */}
          <div className="flex border-b border-slate-100">
            {[1, 2, 3].map(s => (
              <div key={s} className={`flex-1 p-6 text-center font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 ${step === s ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-300'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step === s ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{s}</div>
                <span>{s === 1 ? 'Origen' : s === 2 ? 'Destino' : 'Vínculo'}</span>
              </div>
            ))}
          </div>

          <div className="p-12">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in zoom-in-95">
                <div className="text-center mb-8">
                  <h4 className="text-2xl font-black text-slate-800">¿Quién inicia el contacto?</h4>
                  <p className="text-slate-500 font-medium">Selecciona la persona que representa el punto de partida.</p>
                </div>
                <div className="relative max-w-md mx-auto">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                   <input value={searchSource} onChange={(e)=>setSearchSource(e.target.value)} placeholder="Buscar por nombre..." className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none text-slate-900 font-bold shadow-inner" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-80 overflow-y-auto p-4 scrollbar-hide">
                  {filteredSource.map(p => (
                    <button key={p.id} onClick={()=>{ setFormData({...formData, p1_id: p.id}); setStep(2); }} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center space-y-3 ${formData.p1_id === p.id ? 'border-indigo-600 bg-indigo-50 shadow-lg' : 'border-slate-50 bg-slate-50 hover:border-indigo-200'}`}>
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 font-black">{p.nombre[0]}</div>
                      <span className="text-sm font-black text-slate-800 truncate w-full text-center">{p.nombre} {p.apellido}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in zoom-in-95">
                <div className="text-center mb-8">
                  <h4 className="text-2xl font-black text-slate-800">¿Con quién se conecta?</h4>
                  <p className="text-slate-500 font-medium">Selecciona la contraparte de esta relación.</p>
                </div>
                <div className="relative max-w-md mx-auto">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                   <input value={searchTarget} onChange={(e)=>setSearchTarget(e.target.value)} placeholder="Buscar por nombre..." className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none text-slate-900 font-bold shadow-inner" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-80 overflow-y-auto p-4 scrollbar-hide">
                  {filteredTarget.filter(p => p.id !== formData.p1_id).map(p => (
                    <button key={p.id} onClick={()=>{ setFormData({...formData, p2_id: p.id}); setStep(3); }} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center space-y-3 ${formData.p2_id === p.id ? 'border-indigo-600 bg-indigo-50 shadow-lg' : 'border-slate-50 bg-slate-50 hover:border-indigo-200'}`}>
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 font-black">{p.nombre[0]}</div>
                      <span className="text-sm font-black text-slate-800 truncate w-full text-center">{p.nombre} {p.apellido}</span>
                    </button>
                  ))}
                </div>
                <button onClick={()=>setStep(1)} className="block mx-auto text-slate-400 font-bold hover:text-indigo-600 transition-colors">Volver</button>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in zoom-in-95 text-slate-900">
                <div className="flex items-center justify-center space-x-12 mb-12">
                   <div className="text-center space-y-2">
                      <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-2xl font-black shadow-xl mx-auto">{getPersonName(formData.p1_id)[0]}</div>
                      <p className="font-black text-slate-800 uppercase text-xs tracking-widest">{getPersonName(formData.p1_id)}</p>
                   </div>
                   <ArrowRight className="text-indigo-200" size={48} />
                   <div className="text-center space-y-2">
                      <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-2xl font-black shadow-xl mx-auto">{getPersonName(formData.p2_id)[0]}</div>
                      <p className="font-black text-slate-800 uppercase text-xs tracking-widest">{getPersonName(formData.p2_id)}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tipo de Relación</label>
                    <select value={formData.tipo_relacion} onChange={(e)=>setFormData({...formData, tipo_relacion: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl bg-white text-slate-900 font-bold outline-none focus:border-indigo-500">
                       <option value="amigo">Amigo</option>
                       <option value="familiar">Familiar</option>
                       <option value="socio">Socio</option>
                       <option value="compañero_trabajo">Colega</option>
                    </select>
                    <p className="text-[10px] text-indigo-400 italic mt-1 ml-1">
                      {formData.tipo_relacion === 'amigo' && 'Vínculo basado en afecto e historia común.'}
                      {formData.tipo_relacion === 'socio' && 'Colaboración en negocios o proyectos estratégicos.'}
                      {formData.tipo_relacion === 'compañero_trabajo' && 'Relación profesional en el entorno laboral.'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confianza (1-5)</label>
                    <div className="flex items-center space-x-4">
                       <input type="range" min="1" max="5" value={formData.nivel_confianza} onChange={(e)=>setFormData({...formData, nivel_confianza: parseInt(e.target.value)})} className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                       <span className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black">{formData.nivel_confianza}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Inició el...</label>
                    <input type="date" value={formData.desde} onChange={(e)=>setFormData({...formData, desde: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl bg-white text-slate-900 font-bold outline-none focus:border-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Descripción</label>
                    <textarea value={formData.descripcion} onChange={(e)=>setFormData({...formData, descripcion: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl bg-white text-slate-900 font-bold outline-none focus:border-indigo-500 h-16" placeholder="¿Cómo se conocieron?" />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button type="button" onClick={()=>setStep(2)} className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Atrás</button>
                  <button type="submit" className="flex-[2] py-4 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">Confirmar Conexión</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {relationships.map(rel => (
          <div key={rel.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-2xl hover:border-indigo-50 transition-all group animate-in fade-in duration-500">
            <div className="flex items-center space-x-10">
              <div className="flex -space-x-4">
                 <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black border-4 border-white shadow-lg">{getPersonName(rel.p1_id)[0]}</div>
                 <div className="w-14 h-14 bg-indigo-800 text-white rounded-2xl flex items-center justify-center font-black border-4 border-white shadow-lg">{getPersonName(rel.p2_id)[0]}</div>
              </div>
              <div>
                <div className="flex items-center space-x-3 text-slate-900">
                  <span className="font-black text-lg">{getPersonName(rel.p1_id)}</span>
                  <div className="h-0.5 w-6 bg-indigo-200 rounded-full" />
                  <span className="font-black text-lg">{getPersonName(rel.p2_id)}</span>
                </div>
                <div className="flex flex-wrap gap-4 mt-3 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                  <div className="flex items-center space-x-1.5 bg-indigo-50 px-3 py-1 rounded-full text-indigo-600">
                    <Star size={12} className="fill-current" />
                    <span>{rel.tipo_relacion} • Trust {rel.nivel_confianza}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-slate-50 px-3 py-1 rounded-full">
                    <Calendar size={12} />
                    <span>Desde {rel.desde}</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => { if(window.confirm('¿Eliminar vínculo?')) deleteRelationship(rel.id).then(fetchRelationships); }}
              className="p-4 text-slate-200 hover:text-red-500 hover:bg-red-50 transition-all rounded-2xl"
            >
              <Trash2 size={24} />
            </button>
          </div>
        ))}
      </div>
    </PageContainer>
  );
};

export default RelationshipsPage;
