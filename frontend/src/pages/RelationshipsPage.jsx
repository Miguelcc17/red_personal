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
    descripcion: '', nivel_confianza: 3, fecha_inicio: new Date().toISOString().split('T')[0]
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
        descripcion: '', nivel_confianza: 3, fecha_inicio: new Date().toISOString().split('T')[0]
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
    <PageContainer title="Relationships Management">
      <div className="flex justify-between items-center mb-8">
        <p className="text-gray-600 max-w-lg">Manage how people in your network connect. Define their relationships, trust levels, and shared history.</p>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-bold transition-all shadow-sm ${
            showForm ? 'bg-gray-200 text-gray-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          <Plus size={20} />
          <span>{showForm ? 'Cancel' : 'New Connection'}</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 mb-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">From Person</label>
              <select name="p1_id" value={formData.p1_id} onChange={(e) => setFormData({...formData, p1_id: e.target.value})} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all bg-white" required>
                <option value="">Select person...</option>
                {persons.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">To Person</label>
              <select name="p2_id" value={formData.p2_id} onChange={(e) => setFormData({...formData, p2_id: e.target.value})} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all bg-white" required>
                <option value="">Select person...</option>
                {persons.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Relationship Type</label>
              <select name="tipo_relacion" value={formData.tipo_relacion} onChange={(e) => setFormData({...formData, tipo_relacion: e.target.value})} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all bg-white">
                <option value="amigo">Amigo</option>
                <option value="familiar">Familiar</option>
                <option value="compañero_trabajo">Compañero Trabajo</option>
                <option value="pareja">Pareja</option>
                <option value="conocido">Conocido</option>
                <option value="socio">Socio</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Trust Level (1-5)</label>
              <input type="number" min="1" max="5" name="nivel_confianza" value={formData.nivel_confianza} onChange={(e) => setFormData({...formData, nivel_confianza: parseInt(e.target.value)})} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all bg-white" required />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Start Date</label>
            <input type="date" name="fecha_inicio" value={formData.fecha_inicio} onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all bg-white" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Description</label>
            <textarea name="descripcion" value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all bg-white h-24" placeholder="How they met..." />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md">Create Relationship</button>
        </form>
      )}

      <div className="space-y-4">
        {relationships.map(rel => (
          <div key={rel.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-indigo-100 transition-all group">
            <div className="flex items-center space-x-6">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-full flex-shrink-0">
                <Share2 size={24} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-900">{getPersonName(rel.p1_id)}</span>
                  <span className="text-gray-400 font-medium">and</span>
                  <span className="font-bold text-gray-900">{getPersonName(rel.p2_id)}</span>
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500 font-medium uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <Star size={14} className="text-yellow-500 fill-current" />
                    <span>{rel.tipo_relacion} (Trust {rel.nivel_confianza})</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>Since {rel.fecha_inicio}</span>
                  </div>
                </div>
                {rel.descripcion && (
                  <div className="flex items-start space-x-1 mt-3 text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-50 text-sm">
                    <Info size={14} className="mt-0.5 text-indigo-400 flex-shrink-0" />
                    <span>{rel.descripcion}</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => handleDelete(rel.id)}
              className="p-2 text-gray-300 hover:text-red-500 transition-colors bg-transparent border-0"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        {relationships.length === 0 && (
          <div className="text-center py-20 text-gray-500 font-medium italic">
            No connections established yet. Start building your network!
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default RelationshipsPage;
