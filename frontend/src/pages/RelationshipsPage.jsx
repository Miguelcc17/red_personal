import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { useRelationships } from '../hooks/useRelationships';
import { usePersons } from '../hooks/usePersons';
import { createRelationship, deleteRelationship } from '../api/relationshipsApi';
import Loader from '../components/common/Loader';
import { Plus, Share2, Trash2, Calendar, Star, Info } from 'lucide-react';

const RelationshipsPage = () => {
  const { relationships, loading: rLoading, fetchRelationships } = useRelationships();
  const { persons, loading: pLoading } = usePersons();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    p1_id: '', p2_id: '', tipo_relacion: 'amigo',
    descripcion: '', nivel_confianza: 3, desde: new Date().toISOString().split('T')[0]
  });

  const handleDelete = async (id) => {
    if (window.confirm('Delete relationship?')) {
      await deleteRelationship(id);
      fetchRelationships();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRelationship(formData);
      fetchRelationships();
      setShowForm(false);
      setFormData({
        p1_id: '', p2_id: '', tipo_relacion: 'amigo',
        descripcion: '', nivel_confianza: 3, desde: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      alert('Error creating relationship');
    }
  };

  const getPersonName = (id) => {
    const p = persons.find(per => per.id === id);
    return p ? `${p.nombre} ${p.apellido}` : 'Unknown';
  };

  if (rLoading || pLoading) return <PageContainer title="Relationships"><Loader /></PageContainer>;

  return (
    <PageContainer title="Gestión de Relaciones">
      <div className="flex justify-between items-center mb-8">
        <p className="text-gray-600 max-w-lg italic">Define los vínculos entre las entidades del grafo para permitir análisis de proximidad y confianza.</p>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-black transition-all shadow-lg ${
            showForm ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          <Plus size={20} />
          <span>{showForm ? 'Cancelar' : 'Establecer Vínculo'}</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 mb-12 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Entidad Origen</label>
              <select name="p1_id" value={formData.p1_id} onChange={(e) => setFormData({...formData, p1_id: e.target.value})} className="w-full border-2 border-gray-50 p-4 rounded-2xl focus:border-indigo-500 transition-all bg-gray-50/30 outline-none" required>
                <option value="">Seleccionar persona...</option>
                {persons.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Entidad Destino</label>
              <select name="p2_id" value={formData.p2_id} onChange={(e) => setFormData({...formData, p2_id: e.target.value})} className="w-full border-2 border-gray-50 p-4 rounded-2xl focus:border-indigo-500 transition-all bg-gray-50/30 outline-none" required>
                <option value="">Seleccionar persona...</option>
                {persons.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tipo de Vínculo</label>
              <select name="tipo_relacion" value={formData.tipo_relacion} onChange={(e) => setFormData({...formData, tipo_relacion: e.target.value})} className="w-full border-2 border-gray-50 p-4 rounded-2xl focus:border-indigo-500 transition-all bg-gray-50/30 outline-none">
                <option value="amigo">Amigo</option>
                <option value="familiar">Familiar</option>
                <option value="compañero_trabajo">Compañero Trabajo</option>
                <option value="pareja">Pareja</option>
                <option value="conocido">Conocido</option>
                <option value="socio">Socio</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nivel de Confianza (1-5)</label>
              <input type="number" min="1" max="5" name="nivel_confianza" value={formData.nivel_confianza} onChange={(e) => setFormData({...formData, nivel_confianza: parseInt(e.target.value)})} className="w-full border-2 border-gray-50 p-4 rounded-2xl focus:border-indigo-500 transition-all bg-gray-50/30 outline-none" required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fecha de Inicio</label>
              <input type="date" name="desde" value={formData.desde} onChange={(e) => setFormData({...formData, desde: e.target.value})} className="w-full border-2 border-gray-50 p-4 rounded-2xl focus:border-indigo-500 transition-all bg-gray-50/30 outline-none" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descripción del Vínculo</label>
              <textarea name="descripcion" value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} className="w-full border-2 border-gray-50 p-4 rounded-2xl focus:border-indigo-500 transition-all bg-gray-50/30 outline-none h-16" placeholder="Detalles de cómo se conocieron..." />
            </div>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-xl uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100">Crear Relación en Grafo</button>
        </form>
      )}

      <div className="space-y-4">
        {relationships.map(rel => (
          <div key={rel.id} className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm flex items-center justify-between hover:shadow-xl hover:border-indigo-50 transition-all group">
            <div className="flex items-center space-x-8">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                <Share2 size={28} />
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <span className="font-black text-gray-900 text-lg">{getPersonName(rel.p1_id)}</span>
                  <div className="h-0.5 w-6 bg-indigo-200 rounded-full" />
                  <span className="font-black text-gray-900 text-lg">{getPersonName(rel.p2_id)}</span>
                </div>
                <div className="flex flex-wrap gap-4 mt-3 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                  <div className="flex items-center space-x-1">
                    <Star size={12} className="text-yellow-500 fill-current" />
                    <span className="text-gray-600">{rel.tipo_relacion} (Confianza: {rel.nivel_confianza})</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>Desde {rel.desde}</span>
                  </div>
                </div>
                {rel.descripcion && (
                  <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-4 rounded-2xl italic leading-relaxed">
                    "{rel.descripcion}"
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => handleDelete(rel.id)}
              className="p-3 text-gray-200 hover:text-red-500 transition-colors bg-gray-50/50 rounded-xl"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        {relationships.length === 0 && (
          <div className="text-center py-32 text-gray-400 font-medium italic border-4 border-dashed border-gray-50 rounded-[3rem]">
            No se han establecido conexiones en el grafo aún.
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default RelationshipsPage;
