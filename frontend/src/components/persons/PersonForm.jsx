import React, { useState } from 'react';
import { createPerson } from '../../api/personsApi';

const PersonForm = ({ onCreated }) => {
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', edad: 30, genero: 'Otro',
    ciudad: '', pais: '', profesion: '', email: '', telefono: '',
    descripcion: '', intereses: []
  });
  const [interestInput, setInterestInput] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addInterest = (e) => {
    e.preventDefault();
    if (interestInput.trim()) {
      setFormData({ ...formData, intereses: [...formData.intereses, interestInput.trim()] });
      setInterestInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPerson(formData);
      onCreated();
      setFormData({
        nombre: '', apellido: '', edad: 30, genero: 'Otro',
        ciudad: '', pais: '', profesion: '', email: '', telefono: '',
        descripcion: '', intereses: []
      });
    } catch (err) {
      alert('Error creating person');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-100 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="First Name" required className="border p-2 rounded" />
        <input name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Last Name" required className="border p-2 rounded" />
        <input name="edad" type="number" value={formData.edad} onChange={handleChange} placeholder="Age" required className="border p-2 rounded" />
        <select name="genero" value={formData.genero} onChange={handleChange} className="border p-2 rounded">
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
          <option value="Otro">Otro</option>
        </select>
        <input name="profesion" value={formData.profesion} onChange={handleChange} placeholder="Profession" required className="border p-2 rounded" />
        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="border p-2 rounded" />
        <input name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Phone" className="border p-2 rounded" />
        <input name="ciudad" value={formData.ciudad} onChange={handleChange} placeholder="City" className="border p-2 rounded" />
        <input name="pais" value={formData.pais} onChange={handleChange} placeholder="Country" className="border p-2 rounded" />
      </div>
      <div className="flex space-x-2">
        <input value={interestInput} onChange={(e) => setInterestInput(e.target.value)} placeholder="Add Interest" className="flex-1 border p-2 rounded" />
        <button type="button" onClick={addInterest} className="bg-indigo-500 text-white px-4 py-2 rounded">Add</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {formData.intereses.map((int, i) => (
          <span key={i} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs">{int}</span>
        ))}
      </div>
      <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded h-24" />
      <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700">Create Person</button>
    </form>
  );
};

export default PersonForm;
