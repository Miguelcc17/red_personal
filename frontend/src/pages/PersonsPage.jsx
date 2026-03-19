import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { usePersons } from '../hooks/usePersons';
import { deletePerson } from '../api/personsApi';
import PersonForm from '../components/persons/PersonForm';
import PersonCard from '../components/persons/PersonCard';
import Loader from '../components/common/Loader';
import { Plus, Search } from 'lucide-react';

const PersonsPage = () => {
  const { persons, loading, fetchPersons } = usePersons();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      await deletePerson(id);
      fetchPersons();
    }
  };

  const filteredPersons = persons.filter(p =>
    `${p.nombre} ${p.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.profesion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer title="Persons Management">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or profession..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
          />
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-bold transition-all shadow-sm ${
            showForm ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          <Plus size={20} />
          <span>{showForm ? 'Cancel' : 'Add Person'}</span>
        </button>
      </div>

      {showForm && (
        <PersonForm onCreated={() => {
          fetchPersons();
          setShowForm(false);
        }} />
      )}

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPersons.map(person => (
            <PersonCard
              key={person.id}
              person={person}
              onDelete={handleDelete}
            />
          ))}
          {filteredPersons.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-500">
              No persons found. Try adding one or changing your search.
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
};

export default PersonsPage;
