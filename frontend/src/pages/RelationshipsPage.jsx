import React, { useState, useMemo, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { useRelationships } from '../hooks/useRelationships';
import { usePersons } from '../hooks/usePersons';
import { createRelationship, updateRelationship, deleteRelationship } from '../api/relationshipsApi';
import Loader from '../components/common/Loader';
import { Plus, Share2, Trash2, Calendar, Star, ArrowRight, Search, Info, Clock, MessageSquare, History, Edit2, X, Save } from 'lucide-react';

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
  const [editingRel, setEditingRel] = useState(null);

  const [formData, setFormData] = useState({
    p1_id: '', p2_id: '', tipo_relacion: 'amigo',
    descripcion: '', nivel_confianza: 3,
    desde: new Date().toISOString().split('T')[0],
    hasta: '', estado: 'activa', bitacora: []
  });

  useEffect(() => {
    if (editingRel) {
      setFormData({
        ...editingRel,
        bitacora: editingRel.bitacora || []
      });
      setShowForm(true);
      setStep(3); // Go straight to details for editing
    }
  }, [editingRel]);

  const [logInput, setLogInput] = useState({ fecha: new Date().toISOString().split('T')[0], evento: '', comentario: '' });

  // ⚡ Bolt: Create O(1) lookup map to prevent O(N) Array.find calls during render loop.
  // Reduces O(N * M) rendering complexity when relationships list grows.
  const personsMap = useMemo(() => {
    const map = new Map();
    persons.forEach(p => map.set(p.id, p));
    return map;
  }, [persons]);

  // ⚡ Bolt: Fast O(1) lookup map for relationship types
  const relationshipTypesMap = useMemo(() => {
    const map = new Map();
    RELATIONSHIP_TYPES.forEach(t => map.set(t.id, t));
    return map;
  }, []);

  const selectedTypeObj = useMemo(() => relationshipTypesMap.get(formData.tipo_relacion), [formData.tipo_relacion, relationshipTypesMap]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRel?.id) {
        await updateRelationship(editingRel.id, formData);
      } else {
        await createRelationship(formData);
      }
      fetchRelationships();
      resetForm();
    } catch (err) {
      alert('Error al guardar relación');
    }
  };

  const filteredPersonsStep2 = useMemo(() => persons.filter(p => p.id !== formData.p1_id), [persons, formData.p1_id]);

  const resetForm = () => {
    setShowForm(false);
    setEditingRel(null);
    setStep(1);
    setFormData({ p1_id: '', p2_id: '', tipo_relacion: 'amigo', descripcion: '', nivel_confianza: 3, desde: new Date().toISOString().split('T')[0], hasta: '', estado: 'activa', bitacora: [] });
  };

  const getPersonName = (id) => {
    // ⚡ Bolt: Fast O(1) lookup for relationship names
    const p = personsMap.get(id);
    return p ? `${p.nombre} ${p.apellido}` : 'Desconocido';
  };

  if (rLoading || pLoading) return <PageContainer title="Relationships"><Loader /></PageContainer>;

  return (
    <PageContainer title="Red de Conexiones">
      <div className="bg-slate-900 rounded-[2.5rem] p-10 mb-12 text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-indigo-400">Análisis de Vínculos</h2>
          <p className="text-slate-300 max-w-2xl leading-relaxed font-medium">Gestiona y evoluciona la historia de las conexiones en tu red.</p>
        </div>
        <Share2 className="absolute -right-10 -bottom-10 w-64 h-64 text-indigo-600 opacity-10" />
      </div>

      {!showForm && (
        <div className="flex justify-end mb-8">
          <button onClick={() => setShowForm(true)} className="flex items-center space-x-3 px-10 py-5 rounded-3xl bg-indigo-600 text-white font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl hover:scale-105 active:scale-95">
            <Plus size={24} /> <span>Crear Nueva Conexión</span>
          </button>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl mb-16 overflow-hidden animate-in slide-in-from-top-4 duration-500">
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            {[1, 2, 3].map(s => (
              <div key={s} className={`flex-1 p-8 text-center font-black uppercase tracking-widest text-[10px] flex items-center justify-center space-x-3 ${step === s ? 'text-indigo-600 bg-white border-b-2 border-indigo-600' : 'text-slate-300'}`}>
                <div className={`w-8 h-8 rounded-2xl flex items-center justify-center ${step === s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-200 text-slate-400'}`}>{s}</div>
                <span>{s === 1 ? 'Persona A' : s === 2 ? 'Persona B' : 'Detalles y Bitácora'}</span>
              </div>
            ))}
            <button onClick={resetForm} className="p-8 text-slate-300 hover:text-red-500 transition-colors border-l border-slate-100"><X size={20}/></button>
          </div>

          <div className="p-16">
            {/* Logic for Step 1, 2, 3 as before but ensuring step 3 can work directly for editing */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-12 animate-in fade-in zoom-in-95 text-slate-900">
                {/* Visual Connection Display */}
                <div className="flex items-center justify-center space-x-16">
                   <div className="text-center space-y-4">
                      <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-2xl mx-auto">{getPersonName(formData.p1_id)[0]}</div>
                      <p className="font-black text-slate-900 uppercase text-[10px] tracking-[0.2em]">{getPersonName(formData.p1_id)}</p>
                   </div>
                   <ArrowRight className="text-indigo-200" size={48} />
                   <div className="text-center space-y-4">
                      <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-2xl mx-auto">{getPersonName(formData.p2_id)[0]}</div>
                      <p className="font-black text-slate-900 uppercase text-[10px] tracking-[0.2em]">{getPersonName(formData.p2_id)}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                   <div className="space-y-8">
                      <div className="space-y-2 text-slate-900">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo de Vínculo</label>
                        <select value={formData.tipo_relacion} onChange={(e)=>setFormData({...formData, tipo_relacion: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl bg-white font-bold outline-none focus:border-indigo-500">
                          {RELATIONSHIP_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2 text-slate-900">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</label>
                          <select value={formData.estado} onChange={(e)=>setFormData({...formData, estado: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl bg-white font-bold outline-none focus:border-indigo-500">
                            <option value="activa">Activa</option>
                            <option value="finalizada">Finalizada</option>
                            <option value="distante">Distante</option>
                            <option value="conflicto">Conflicto</option>
                          </select>
                        </div>
                        <div className="space-y-2 text-slate-900">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedTypeObj?.trustLabel || 'Confianza'}</label>
                          <input type="range" min="1" max="5" value={formData.nivel_confianza} onChange={(e)=>setFormData({...formData, nivel_confianza: parseInt(e.target.value)})} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-6" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                         <input type="date" value={formData.desde} onChange={(e)=>setFormData({...formData, desde: e.target.value})} className="border-2 border-slate-100 p-4 rounded-2xl font-bold" />
                         <input type="date" value={formData.hasta} onChange={(e)=>setFormData({...formData, hasta: e.target.value})} disabled={formData.estado === 'activa'} className="border-2 border-slate-100 p-4 rounded-2xl font-bold disabled:opacity-30" />
                      </div>
                      <textarea value={formData.descripcion} onChange={(e)=>setFormData({...formData, descripcion: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-bold h-24" placeholder="Descripción general..." />
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

                <button type="submit" className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-2xl uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-2xl flex items-center justify-center space-x-4">
                  <Save size={28}/> <span>{editingRel ? 'Actualizar Cambios' : 'Confirmar Vínculo'}</span>
                </button>
              </form>
            )}

            {step === 1 && (
              <div className="animate-in fade-in zoom-in-95">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-h-[500px] overflow-y-auto p-6 scrollbar-hide">
                  {persons.map(p => (
                    <button key={p.id} onClick={()=>{ setFormData({...formData, p1_id: p.id}); setStep(2); }} className="p-8 rounded-[2.5rem] border-2 border-slate-50 bg-slate-50 hover:border-indigo-600 transition-all flex flex-col items-center space-y-4 shadow-sm hover:shadow-xl hover:scale-105">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 text-xl font-black uppercase">{p.nombre[0]}{p.apellido[0]}</div>
                      <span className="text-xs font-black uppercase text-slate-800 text-center">{p.nombre} {p.apellido}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in zoom-in-95">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-h-[500px] overflow-y-auto p-6 scrollbar-hide">
                  {filteredPersonsStep2.map(p => (
                    <button key={p.id} onClick={()=>{ setFormData({...formData, p2_id: p.id}); setStep(3); }} className="p-8 rounded-[2.5rem] border-2 border-slate-50 bg-slate-50 hover:border-indigo-600 transition-all flex flex-col items-center space-y-4 shadow-sm hover:shadow-xl hover:scale-105">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 text-xl font-black uppercase">{p.nombre[0]}{p.apellido[0]}</div>
                      <span className="text-xs font-black uppercase text-slate-800 text-center">{p.nombre} {p.apellido}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {relationships.map(rel => (
          <div key={rel.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-2xl hover:border-indigo-50 transition-all group animate-in fade-in duration-500">
            <div className="flex items-center space-x-12">
              <div className="flex -space-x-6 group-hover:-space-x-2 transition-all">
                 <div className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center font-black border-4 border-white shadow-xl uppercase">{getPersonName(rel.p1_id)[0]}</div>
                 <div className="w-16 h-16 bg-indigo-600 text-white rounded-3xl flex items-center justify-center font-black border-4 border-white shadow-xl uppercase">{getPersonName(rel.p2_id)[0]}</div>
              </div>
              <div className="text-slate-900">
                <div className="flex items-center space-x-4">
                  <span className="font-black text-xl tracking-tight">{getPersonName(rel.p1_id)}</span>
                  <ArrowRight className="text-indigo-200" size={24} />
                  <span className="font-black text-xl tracking-tight">{getPersonName(rel.p2_id)}</span>
                </div>
                <div className="flex flex-wrap gap-6 mt-4 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                  <div className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-2xl text-indigo-700 border border-indigo-100">
                    <Star size={14} className="fill-current" />
                    <span>{relationshipTypesMap.get(rel.tipo_relacion)?.label || rel.tipo_relacion} • {rel.nivel_confianza}/5</span>
                  </div>
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-2xl border shadow-sm ${rel.estado === 'activa' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                    <Clock size={14} /> <span>{rel.estado}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => setEditingRel(rel)} className="p-5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all rounded-[2rem]"><Edit2 size={24}/></button>
              <button onClick={() => { if(window.confirm('¿Eliminar vínculo?')) deleteRelationship(rel.id).then(fetchRelationships); }} className="p-5 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all rounded-[2rem]"><Trash2 size={24}/></button>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
};

export default RelationshipsPage;
