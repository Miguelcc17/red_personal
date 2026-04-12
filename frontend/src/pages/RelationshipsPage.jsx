import React, { useState, useMemo } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { useRelationships } from '../hooks/useRelationships';
import { usePersons } from '../hooks/usePersons';
import { createRelationship, deleteRelationship } from '../api/relationshipsApi';
import Loader from '../components/common/Loader';
import { Plus, Share2, Trash2, Calendar, Star, ArrowRight, User, Search, Info, Clock, AlertCircle } from 'lucide-react';

const RELATIONSHIP_TYPES = [
  { id: 'amigo', label: 'Amigo/a', trustLabel: 'Nivel de Amistad', help: 'Vínculo basado en afecto e historia común.' },
  { id: 'familiar', label: 'Familiar', trustLabel: 'Cercanía Familiar', help: 'Relación de parentesco biológico o legal.' },
  { id: 'compañero_trabajo', label: 'Colega de Trabajo', trustLabel: 'Sinergia Laboral', help: 'Personas que comparten entorno profesional.' },
  { id: 'pareja', label: 'Pareja', trustLabel: 'Intimidad/Compromiso', help: 'Relación sentimental o afectiva estable.' },
  { id: 'socio', label: 'Socio/a de Negocio', trustLabel: 'Confianza Estratégica', help: 'Colaboración en proyectos comerciales.' },
  { id: 'hermano_a', label: 'Hermano/a', trustLabel: 'Vínculo Fraterno', help: 'Relación entre hermanos.' },
  { id: 'padre_madre', label: 'Padre/Madre', trustLabel: 'Respeto/Cuidado', help: 'Relación ascendente directa.' },
  { id: 'hijo_a', label: 'Hijo/a', trustLabel: 'Protección/Afecto', help: 'Relación descendente directa.' },
  { id: 'mentor_a', label: 'Mentor/a', trustLabel: 'Influencia/Guía', help: 'Relación de aprendizaje y tutoría.' },
  { id: 'cliente', label: 'Cliente', trustLabel: 'Satisfacción/Lealtad', help: 'Relación comercial de servicio.' },
  { id: 'proveedor', label: 'Proveedor', trustLabel: 'Cumplimiento/Calidad', help: 'Relación comercial de suministro.' },
  { id: 'ex_pareja', label: 'Ex-pareja', trustLabel: 'Relación Actual', help: 'Vínculo sentimental finalizado.' },
  { id: 'vecino_a', label: 'Vecino/a', trustLabel: 'Convivencia', help: 'Proximidad geográfica residencial.' },
  { id: 'compañero_estudio', label: 'Compañero/a de Estudio', trustLabel: 'Colaboración Académica', help: 'Relación en entorno educativo.' },
  { id: 'colega_sector', label: 'Colega del Sector', trustLabel: 'Reconocimiento Prof.', help: 'Profesionales del mismo rubro.' },
  { id: 'inversionista', label: 'Inversionista', trustLabel: 'Respaldo Financiero', help: 'Relación de financiamiento.' },
  { id: 'cofundador_a', label: 'Cofundador/a', trustLabel: 'Visión Compartida', help: 'Socios fundadores de entidad.' },
  { id: 'conocido', label: 'Conocido/a', trustLabel: 'Familiaridad', help: 'Vínculo superficial o inicial.' },
  { id: 'rival', label: 'Rival', trustLabel: 'Competitividad', help: 'Relación de competencia directa.' },
  { id: 'enemigo_a', label: 'Enemigo/a', trustLabel: 'Nivel de Conflicto', help: 'Vínculo de hostilidad manifiesta.' }
];

const RelationshipsPage = () => {
  const { relationships, loading: rLoading, fetchRelationships } = useRelationships();
  const { persons, loading: pLoading } = usePersons();
  const [step, setStep] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [searchSource, setSearchSource] = useState('');
  const [searchTarget, setSearchTarget] = useState('');
  const [searchType, setSearchType] = useState('');

  const [formData, setFormData] = useState({
    p1_id: '', p2_id: '', tipo_relacion: 'amigo',
    descripcion: '', nivel_confianza: 3,
    desde: new Date().toISOString().split('T')[0],
    hasta: '', estado: 'activa'
  });

  const filteredSource = useMemo(() => persons.filter(p => `${p.nombre} ${p.apellido}`.toLowerCase().includes(searchSource.toLowerCase())), [persons, searchSource]);
  const filteredTarget = useMemo(() => persons.filter(p => `${p.nombre} ${p.apellido}`.toLowerCase().includes(searchTarget.toLowerCase())), [persons, searchTarget]);
  const filteredTypes = useMemo(() => RELATIONSHIP_TYPES.filter(t => t.label.toLowerCase().includes(searchType.toLowerCase())), [searchType]);

  const selectedTypeObj = useMemo(() => RELATIONSHIP_TYPES.find(t => t.id === formData.tipo_relacion), [formData.tipo_relacion]);

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
    setFormData({ p1_id: '', p2_id: '', tipo_relacion: 'amigo', descripcion: '', nivel_confianza: 3, desde: new Date().toISOString().split('T')[0], hasta: '', estado: 'activa' });
  };

  const getPersonName = (id) => {
    const p = persons.find(per => per.id === id);
    return p ? `${p.nombre} ${p.apellido}` : 'Desconocido';
  };

  if (rLoading || pLoading) return <PageContainer title="Relationships"><Loader /></PageContainer>;

  return (
    <PageContainer title="Red de Conexiones">
      <div className="bg-slate-900 rounded-[2.5rem] p-10 mb-12 text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-indigo-400">Análisis de Vínculos</h2>
          <p className="text-slate-300 max-w-2xl leading-relaxed font-medium">
            Define la naturaleza de las conexiones entre individuos. Registra la historia completa, incluyendo el estado actual y la duración de la relación para un análisis temporal profundo.
          </p>
        </div>
        <Share2 className="absolute -right-10 -bottom-10 w-64 h-64 text-indigo-600 opacity-10" />
      </div>

      {!showForm ? (
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-3 px-10 py-5 rounded-3xl bg-indigo-600 text-white font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:scale-105 active:scale-95"
          >
            <Plus size={24} />
            <span>Crear Nueva Conexión</span>
          </button>
        </div>
      ) : null}

      {showForm && (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl mb-16 overflow-hidden animate-in slide-in-from-top-4 duration-500">
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            {[1, 2, 3].map(s => (
              <div key={s} className={`flex-1 p-8 text-center font-black uppercase tracking-widest text-[10px] flex items-center justify-center space-x-3 ${step === s ? 'text-indigo-600 bg-white border-b-2 border-indigo-600' : 'text-slate-300'}`}>
                <div className={`w-8 h-8 rounded-2xl flex items-center justify-center ${step === s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-200 text-slate-400'}`}>{s}</div>
                <span>{s === 1 ? 'Persona A' : s === 2 ? 'Persona B' : 'Detalles del Vínculo'}</span>
              </div>
            ))}
          </div>

          <div className="p-16">
            {step === 1 && (
              <div className="space-y-10 animate-in fade-in zoom-in-95">
                <div className="text-center space-y-2">
                  <h4 className="text-3xl font-black text-slate-900">Selecciona el Origen</h4>
                  <p className="text-slate-500 font-medium italic">¿Quién inicia esta conexión en el grafo?</p>
                </div>
                <div className="relative max-w-xl mx-auto group">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={24} />
                   <input value={searchSource} onChange={(e)=>setSearchSource(e.target.value)} placeholder="Buscar por nombre o apellido..." className="w-full pl-16 pr-6 py-5 rounded-[2rem] border-2 border-slate-100 focus:border-indigo-500 outline-none text-slate-900 font-bold shadow-sm transition-all" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-h-[400px] overflow-y-auto p-6 scrollbar-hide">
                  {filteredSource.map(p => (
                    <button key={p.id} onClick={()=>{ setFormData({...formData, p1_id: p.id}); setStep(2); }} className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center space-y-4 hover:scale-105 ${formData.p1_id === p.id ? 'border-indigo-600 bg-indigo-50 shadow-2xl' : 'border-slate-50 bg-slate-50 hover:border-indigo-200 shadow-sm'}`}>
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center text-indigo-600 text-xl font-black uppercase">{p.nombre[0]}{p.apellido[0]}</div>
                      <span className="text-xs font-black text-slate-800 uppercase tracking-tighter text-center">{p.nombre} {p.apellido}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-10 animate-in fade-in zoom-in-95">
                <div className="text-center space-y-2">
                  <h4 className="text-3xl font-black text-slate-900">Selecciona el Destino</h4>
                  <p className="text-slate-500 font-medium italic">¿Con quién se vincula {getPersonName(formData.p1_id)}?</p>
                </div>
                <div className="relative max-w-xl mx-auto group">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={24} />
                   <input value={searchTarget} onChange={(e)=>setSearchTarget(e.target.value)} placeholder="Buscar por nombre..." className="w-full pl-16 pr-6 py-5 rounded-[2rem] border-2 border-slate-100 focus:border-indigo-500 outline-none text-slate-900 font-bold shadow-sm transition-all" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-h-[400px] overflow-y-auto p-6 scrollbar-hide">
                  {filteredTarget.filter(p => p.id !== formData.p1_id).map(p => (
                    <button key={p.id} onClick={()=>{ setFormData({...formData, p2_id: p.id}); setStep(3); }} className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center space-y-4 hover:scale-105 ${formData.p2_id === p.id ? 'border-indigo-600 bg-indigo-50 shadow-2xl' : 'border-slate-50 bg-slate-50 hover:border-indigo-200 shadow-sm'}`}>
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center text-indigo-600 text-xl font-black uppercase">{p.nombre[0]}{p.apellido[0]}</div>
                      <span className="text-xs font-black text-slate-800 uppercase tracking-tighter text-center">{p.nombre} {p.apellido}</span>
                    </button>
                  ))}
                </div>
                <button onClick={()=>setStep(1)} className="block mx-auto text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] hover:text-indigo-600 transition-colors">← Volver al Origen</button>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-12 animate-in fade-in zoom-in-95 text-slate-900">
                <div className="flex items-center justify-center space-x-16">
                   <div className="text-center space-y-4 group">
                      <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-2xl mx-auto group-hover:scale-110 transition-transform">{getPersonName(formData.p1_id)[0]}</div>
                      <p className="font-black text-slate-900 uppercase text-[10px] tracking-[0.2em]">{getPersonName(formData.p1_id)}</p>
                   </div>
                   <div className="flex flex-col items-center space-y-2">
                      <div className="h-0.5 w-32 bg-gradient-to-r from-slate-900 to-indigo-600 rounded-full" />
                      <Share2 className="text-indigo-600 animate-pulse" size={32} />
                   </div>
                   <div className="text-center space-y-4 group">
                      <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-2xl mx-auto group-hover:scale-110 transition-transform">{getPersonName(formData.p2_id)[0]}</div>
                      <p className="font-black text-slate-900 uppercase text-[10px] tracking-[0.2em]">{getPersonName(formData.p2_id)}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Naturaleza del Vínculo</label>
                      <div className="relative group">
                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                         <input value={searchType} onChange={(e)=>setSearchType(e.target.value)} placeholder="Filtrar tipos..." className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 text-sm font-bold bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border-2 border-slate-100 rounded-2xl bg-white shadow-inner">
                        {filteredTypes.map(t => (
                          <button key={t.id} type="button" onClick={()=>setFormData({...formData, tipo_relacion: t.id})} className={`p-3 rounded-xl text-[10px] font-black uppercase text-left transition-all ${formData.tipo_relacion === t.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                            {t.label}
                          </button>
                        ))}
                      </div>
                      {selectedTypeObj && (
                        <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 flex items-start space-x-3 mt-4">
                           <Info className="text-indigo-600 mt-0.5" size={14} />
                           <p className="text-[11px] text-indigo-700 font-medium leading-relaxed italic">"{selectedTypeObj.help}"</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Estado de la Relación</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['activa', 'finalizada', 'distante', 'conflicto'].map(s => (
                          <button key={s} type="button" onClick={()=>setFormData({...formData, estado: s})} className={`p-3 rounded-xl text-[10px] font-black uppercase transition-all ${formData.estado === s ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{selectedTypeObj?.trustLabel || 'Nivel de Confianza'}</label>
                      <div className="flex items-center space-x-6 bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
                         <input type="range" min="1" max="5" value={formData.nivel_confianza} onChange={(e)=>setFormData({...formData, nivel_confianza: parseInt(e.target.value)})} className="flex-1 h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600" />
                         <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex flex-col items-center justify-center shadow-xl shadow-indigo-100">
                            <span className="text-xl font-black">{formData.nivel_confianza}</span>
                            <span className="text-[8px] font-bold uppercase opacity-50">/ 5</span>
                         </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Inició el...</label>
                        <input type="date" value={formData.desde} onChange={(e)=>setFormData({...formData, desde: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl bg-white text-slate-900 font-bold outline-none focus:border-indigo-500 shadow-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Terminó el...</label>
                        <input type="date" value={formData.hasta} onChange={(e)=>setFormData({...formData, hasta: e.target.value})} disabled={formData.estado === 'activa'} className={`w-full border-2 border-slate-100 p-4 rounded-2xl bg-white text-slate-900 font-bold outline-none focus:border-indigo-500 shadow-sm ${formData.estado === 'activa' ? 'opacity-30 cursor-not-allowed' : ''}`} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contexto Detallado</label>
                      <textarea value={formData.descripcion} onChange={(e)=>setFormData({...formData, descripcion: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl bg-white text-slate-900 font-bold outline-none focus:border-indigo-500 h-24 shadow-sm" placeholder="Añade notas sobre el origen del vínculo..." />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-6 pt-8 border-t border-slate-100">
                  <button type="button" onClick={()=>setStep(2)} className="flex-1 py-5 rounded-[2rem] bg-slate-100 text-slate-600 font-black uppercase tracking-widest hover:bg-slate-200 transition-all">← Anterior</button>
                  <button type="submit" className="flex-[3] py-5 rounded-[2rem] bg-indigo-600 text-white font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 hover:scale-[1.01]">Establecer Vínculo en el Grafo</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {relationships.map(rel => (
          <div key={rel.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-2xl hover:border-indigo-100 transition-all group animate-in fade-in duration-500">
            <div className="flex items-center space-x-12">
              <div className="flex -space-x-6 group-hover:-space-x-2 transition-all">
                 <div className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center font-black border-4 border-white shadow-xl uppercase">{getPersonName(rel.p1_id)[0]}</div>
                 <div className="w-16 h-16 bg-indigo-600 text-white rounded-3xl flex items-center justify-center font-black border-4 border-white shadow-xl uppercase">{getPersonName(rel.p2_id)[0]}</div>
              </div>
              <div>
                <div className="flex items-center space-x-4 text-slate-900">
                  <span className="font-black text-xl tracking-tight">{getPersonName(rel.p1_id)}</span>
                  <ArrowRight className="text-indigo-200" size={24} />
                  <span className="font-black text-xl tracking-tight">{getPersonName(rel.p2_id)}</span>
                </div>
                <div className="flex flex-wrap gap-6 mt-4 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                  <div className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-2xl text-indigo-700 border border-indigo-100 shadow-sm">
                    <Star size={14} className="fill-current" />
                    <span>{RELATIONSHIP_TYPES.find(t=>t.id===rel.tipo_relacion)?.label || rel.tipo_relacion} • {rel.nivel_confianza}/5</span>
                  </div>
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-2xl border shadow-sm ${rel.estado === 'activa' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                    <Clock size={14} />
                    <span className="uppercase">{rel.estado}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                    <Calendar size={14} />
                    <span>{rel.desde} {rel.hasta ? `a ${rel.hasta}` : '(Actualidad)'}</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => { if(window.confirm('¿Deseas eliminar este vínculo permanentemente?')) deleteRelationship(rel.id).then(fetchRelationships); }}
              className="p-5 text-slate-200 hover:text-red-500 hover:bg-red-50 transition-all rounded-[2rem] border border-transparent hover:border-red-100"
            >
              <Trash2 size={28} />
            </button>
          </div>
        ))}
      </div>
    </PageContainer>
  );
};

export default RelationshipsPage;
