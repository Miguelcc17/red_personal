import React, { useState, useMemo } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { usePersons } from '../hooks/usePersons';
import { deletePerson, getPerson } from '../api/personsApi';
import PersonForm from '../components/persons/PersonForm';
import PersonCard from '../components/persons/PersonCard';
import Loader from '../components/common/Loader';
import { Plus, Search, X } from 'lucide-react';

const PersonsPage = () => {
  const { persons, loading, fetchPersons } = usePersons();
  const [showForm, setShowForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta persona?')) {
      await deletePerson(id);
      fetchPersons();
    }
  };

  const handleEdit = async (person) => {
    try {
      // Fetch full person data before editing to ensure related nodes are included
      const fullData = await getPerson(person.id);
      setEditingPerson(fullData);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert('Error al recuperar datos de la persona.');
    }
  };

  const filteredPersons = useMemo(() => {
    if (!searchTerm) return persons; // ⚡ Bolt: Early return when search is empty to avoid O(N) iteration
    const term = searchTerm.toLowerCase();
    return persons.filter(p =>
      `${p.nombre} ${p.apellido}`.toLowerCase().includes(term) ||
      (p.profesion && p.profesion.toLowerCase().includes(term))
    );
  }, [persons, searchTerm]);

  return (
    <PageContainer title="Gestión de Personas">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o profesión..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all shadow-sm bg-white text-slate-900 font-medium"
          />
        </div>
        <button
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setEditingPerson(null);
            } else {
              setShowForm(true);
            }
          }}
          className={`flex items-center space-x-2 px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg hover:scale-105 active:scale-95 ${
            showForm ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
          }`}
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          <span>{showForm ? 'Cancelar' : 'Añadir Persona'}</span>
        </button>
      </div>

      {showForm && (
        <PersonForm
          initialData={editingPerson}
          onCreated={() => {
            fetchPersons();
            setShowForm(false);
            setEditingPerson(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingPerson(null);
          }}
        />
      )}

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPersons.map(person => (
            <PersonCard
              key={person.id}
              person={person}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
          {filteredPersons.length === 0 && (
            <div className="col-span-full text-center py-32 text-slate-400 border-4 border-dashed border-slate-50 rounded-[3rem] font-medium italic">
              No se encontraron personas. Intenta añadir una nueva.
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
};

export default PersonsPage;
