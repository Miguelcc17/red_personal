import React, { useState } from 'react';
import { createPerson } from '../../api/personsApi';
import { Plus, Trash2 } from 'lucide-react';

const PersonForm = ({ onCreated }) => {
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', edad: 30, genero: '',
    ciudad: '', pais: '', profesion: '', email: '', telefono: '',
    descripcion: '', intereses: [],
    hobbies: [], colores_favoritos: [], signo_zodiacal: '',
    tiene_tatuajes: false, tatuajes_descripcion: '', historial_trabajos: []
  });

  const [interestInput, setInterestInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [hobbyInput, setHobbyInput] = useState({ name: '', active: true });
  const [jobInput, setJobInput] = useState({ company: '', role: '', period: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const addInterest = () => {
    if (interestInput.trim()) {
      setFormData({ ...formData, intereses: [...formData.intereses, interestInput.trim()] });
      setInterestInput('');
    }
  };

  const addColor = () => {
    if (colorInput.trim()) {
      setFormData({ ...formData, colores_favoritos: [...formData.colores_favoritos, colorInput.trim()] });
      setColorInput('');
    }
  };

  const addHobby = () => {
    if (hobbyInput.name.trim()) {
      setFormData({ ...formData, hobbies: [...formData.hobbies, hobbyInput] });
      setHobbyInput({ name: '', active: true });
    }
  };

  const addJob = () => {
    if (jobInput.company.trim()) {
      setFormData({ ...formData, historial_trabajos: [...formData.historial_trabajos, jobInput] });
      setJobInput({ company: '', role: '', period: '' });
    }
  };

  const removeItem = (field, index) => {
    const newList = [...formData[field]];
    newList.splice(index, 1);
    setFormData({ ...formData, [field]: newList });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPerson(formData);
      onCreated();
    } catch (err) {
      alert('Error creating person');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-xl mb-12">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Información Básica</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Nombre</label>
          <input name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full border p-2 rounded-lg" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Apellido</label>
          <input name="apellido" value={formData.apellido} onChange={handleChange} required className="w-full border p-2 rounded-lg" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Edad</label>
          <input name="edad" type="number" value={formData.edad} onChange={handleChange} required className="w-full border p-2 rounded-lg" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Género</label>
          <input name="genero" value={formData.genero} onChange={handleChange} className="w-full border p-2 rounded-lg" placeholder="Opcional" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Profesión</label>
          <input name="profesion" value={formData.profesion} onChange={handleChange} required className="w-full border p-2 rounded-lg" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Signo Zodiacal</label>
          <input name="signo_zodiacal" value={formData.signo_zodiacal} onChange={handleChange} className="w-full border p-2 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full border p-2 rounded-lg" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Teléfono</label>
          <input name="telefono" value={formData.telefono} onChange={handleChange} required className="w-full border p-2 rounded-lg" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-800 border-b pb-2 pt-4">Análisis de Perfil</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hobbies Section */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-500 uppercase">Hobbies & Historial</label>
          <div className="flex space-x-2">
            <input value={hobbyInput.name} onChange={(e) => setHobbyInput({...hobbyInput, name: e.target.value})} placeholder="Nombre del hobby" className="flex-1 border p-2 rounded-lg text-sm" />
            <label className="flex items-center text-xs space-x-1">
              <input type="checkbox" checked={hobbyInput.active} onChange={(e) => setHobbyInput({...hobbyInput, active: e.target.checked})} />
              <span>Activo</span>
            </label>
            <button type="button" onClick={addHobby} className="bg-indigo-500 text-white p-2 rounded-lg"><Plus size={16}/></button>
          </div>
          <div className="space-y-2">
            {formData.hobbies.map((h, i) => (
              <div key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
                <span>{h.name} {h.active ? '✅' : '📜'}</span>
                <button type="button" onClick={() => removeItem('hobbies', i)} className="text-red-400"><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
        </div>

        {/* Colors & Interests */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Colores Favoritos</label>
            <div className="flex space-x-2">
              <input value={colorInput} onChange={(e) => setColorInput(e.target.value)} className="flex-1 border p-2 rounded-lg text-sm" />
              <button type="button" onClick={addColor} className="bg-indigo-500 text-white p-2 rounded-lg"><Plus size={16}/></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.colores_favoritos.map((c, i) => (
                <span key={i} className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center space-x-1">
                  <span>{c}</span>
                  <button type="button" onClick={() => removeItem('colores_favoritos', i)} className="text-gray-400">&times;</button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <label className="text-xs font-bold text-gray-500 uppercase">Historial de Trabajos</label>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input placeholder="Empresa" value={jobInput.company} onChange={(e) => setJobInput({...jobInput, company: e.target.value})} className="border p-2 rounded-lg text-sm" />
          <input placeholder="Cargo" value={jobInput.role} onChange={(e) => setJobInput({...jobInput, role: e.target.value})} className="border p-2 rounded-lg text-sm" />
          <input placeholder="Periodo" value={jobInput.period} onChange={(e) => setJobInput({...jobInput, period: e.target.value})} className="border p-2 rounded-lg text-sm" />
          <button type="button" onClick={addJob} className="bg-indigo-500 text-white p-2 rounded-lg flex items-center justify-center space-x-2">
            <Plus size={16}/> <span>Añadir</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {formData.historial_trabajos.map((j, i) => (
            <div key={i} className="bg-indigo-50 p-3 rounded-lg flex justify-between items-center text-sm border border-indigo-100">
              <div>
                <p className="font-bold">{j.company}</p>
                <p className="text-xs text-indigo-600">{j.role} | {j.period}</p>
              </div>
              <button type="button" onClick={() => removeItem('historial_trabajos', i)} className="text-red-400"><Trash2 size={16}/></button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
        <div className="space-y-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" name="tiene_tatuajes" checked={formData.tiene_tatuajes} onChange={handleChange} className="w-5 h-5 rounded" />
            <span className="font-bold text-gray-700">¿Tiene tatuajes?</span>
          </label>
          {formData.tiene_tatuajes && (
            <textarea name="tatuajes_descripcion" value={formData.tatuajes_descripcion} onChange={handleChange} placeholder="Describe los tatuajes..." className="w-full border p-3 rounded-xl h-24 text-sm" />
          )}
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Descripción General</label>
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="w-full border p-3 rounded-xl h-32 text-sm" />
        </div>
      </div>

      <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
        Crear Perfil de Análisis
      </button>
    </form>
  );
};

export default PersonForm;
