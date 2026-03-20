import React, { useState } from 'react';
import { createPerson } from '../../api/personsApi';
import { Plus, Trash2, MapPin, Briefcase, Star, Hash, Building, BookOpen, Target, Scissors } from 'lucide-react';

const PersonForm = ({ onCreated }) => {
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', fecha_nacimiento: '',
    signo_zodiacal: '', eneagrama: '', genero: '',
    ciudad_nacimiento: '', pais_nacimiento: '',
    ciudad_residencia: '', pais_residencia: '',
    email: '', telefono: '',
    profesion: '', rol_actual: '', modelo_trabajo: 'remoto',
    vision_largo_plazo: '', disciplina_principal: '', mentalidad_competitiva: 'mixto',
    descripcion: '',
    hobbies: [], colores_favoritos: [], valores_fundamentales: [],
    disparadores_estres: [], motivadores: [], soft_skills: [], especializacion: [],
    idiomas: [], tatuajes: { tiene_tatuajes: false, descripcion: '', estilo: '', significado: '', cantidad: 0 },
    historial_trabajos: [], educacion: [], metas: []
  });

  const [inputState, setInputState] = useState({ hobby: '', skill: '', spec: '', lang: '', langLevel: 'B1', value: '', stress: '', motiv: '', color: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({ ...formData, [parent]: { ...formData[parent], [child]: type === 'checkbox' ? checked : value } });
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const addItem = (field, value, extras = {}) => {
    if (value.trim()) {
      setFormData({ ...formData, [field]: [...formData[field], typeof value === 'string' ? (Object.keys(extras).length ? { nombre: value, ...extras } : value) : value] });
      setInputState({ ...inputState, [field]: '' });
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
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-10 rounded-3xl border border-gray-100 shadow-2xl mb-16 max-w-6xl mx-auto">
      <div className="border-b pb-4">
        <h2 className="text-3xl font-extrabold text-gray-900">Análisis de Perfil Avanzado</h2>
        <p className="text-gray-500 mt-1">Modelado de grafo completo para análisis profundo de comportamiento y trayectoria.</p>
      </div>

      {/* Sección 1: Identidad Base */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2 text-indigo-600 font-bold uppercase tracking-widest text-sm">
          <Hash size={18}/> <span>Identidad Base</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input name="nombre" placeholder="Nombre" onChange={handleChange} required className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          <input name="apellido" placeholder="Apellido" onChange={handleChange} required className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          <input name="fecha_nacimiento" type="date" onChange={handleChange} className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          <input name="telefono" placeholder="Teléfono" onChange={handleChange} required className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          <select name="genero" onChange={handleChange} className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
            <option value="">Género...</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="No binario">No binario</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
      </section>

      {/* Sección 2: Ubicación y Origen */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2 text-indigo-600 font-bold uppercase tracking-widest text-sm">
          <MapPin size={18}/> <span>Ubicación e Historia</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-gray-50 rounded-2xl space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase">Origen (BORN_IN)</p>
            <div className="grid grid-cols-2 gap-4">
              <input name="ciudad_nacimiento" placeholder="Ciudad" onChange={handleChange} className="bg-white border p-2 rounded-lg text-sm" />
              <input name="pais_nacimiento" placeholder="País" onChange={handleChange} className="bg-white border p-2 rounded-lg text-sm" />
            </div>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase">Residencia (LIVES_IN)</p>
            <div className="grid grid-cols-2 gap-4">
              <input name="ciudad_residencia" placeholder="Ciudad" onChange={handleChange} className="bg-white border p-2 rounded-lg text-sm" />
              <input name="pais_residencia" placeholder="País" onChange={handleChange} className="bg-white border p-2 rounded-lg text-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* Sección 3: Perfil Profesional */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2 text-indigo-600 font-bold uppercase tracking-widest text-sm">
          <Briefcase size={18}/> <span>Perfil Profesional (WORKS_AS)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input name="profesion" placeholder="Profesión (Ej: Full Stack Dev)" onChange={handleChange} className="border p-3 rounded-xl outline-none" />
          <input name="rol_actual" placeholder="Rol Actual" onChange={handleChange} className="border p-3 rounded-xl outline-none" />
          <select name="modelo_trabajo" onChange={handleChange} className="border p-3 rounded-xl outline-none">
            <option value="remoto">Remoto</option>
            <option value="presencial">Presencial</option>
            <option value="hibrido">Híbrido</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>
        <textarea name="vision_largo_plazo" placeholder="Visión a largo plazo..." onChange={handleChange} className="w-full border p-4 rounded-2xl h-24" />
      </section>

      {/* Sección 4: Análisis Psicológico y Conductual */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2 text-indigo-600 font-bold uppercase tracking-widest text-sm">
          <Star size={18}/> <span>Análisis Psicológico y Simbólico</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input name="signo_zodiacal" placeholder="Signo Zodiacal" onChange={handleChange} className="border p-3 rounded-xl" />
          <input name="eneagrama" placeholder="Eneagrama (Ej: 5w6)" onChange={handleChange} className="border p-3 rounded-xl" />
          <select name="mentalidad_competitiva" onChange={handleChange} className="border p-3 rounded-xl">
            <option value="mixto">Mentalidad Mixta</option>
            <option value="competitivo">Competitivo</option>
            <option value="cooperativo">Cooperativo</option>
          </select>
        </div>

        {/* Arrays Dinámicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Valores Fundamentales</label>
            <div className="flex space-x-2">
              <input value={inputState.value} onChange={(e)=>setInputState({...inputState, value: e.target.value})} className="flex-1 border p-2 rounded-lg text-sm" />
              <button type="button" onClick={()=>addItem('valores_fundamentales', inputState.value)} className="bg-indigo-500 text-white p-2 rounded-lg"><Plus size={16}/></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.valores_fundamentales.map((v, i) => (
                <span key={i} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs flex items-center space-x-1">
                  <span>{v}</span>
                  <button type="button" onClick={()=>removeItem('valores_fundamentales', i)} className="ml-1 opacity-50 hover:opacity-100">&times;</button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Motivadores</label>
            <div className="flex space-x-2">
              <input value={inputState.motiv} onChange={(e)=>setInputState({...inputState, motiv: e.target.value})} className="flex-1 border p-2 rounded-lg text-sm" />
              <button type="button" onClick={()=>addItem('motivadores', inputState.motiv)} className="bg-indigo-500 text-white p-2 rounded-lg"><Plus size={16}/></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.motivadores.map((v, i) => (
                <span key={i} className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs flex items-center space-x-1">
                  <span>{v}</span>
                  <button type="button" onClick={()=>removeItem('motivadores', i)} className="ml-1 opacity-50 hover:opacity-100">&times;</button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sección 5: Historiales Temporales */}
      <section className="space-y-8 pt-8 border-t">
        <div className="flex items-center space-x-2 text-indigo-600 font-bold uppercase tracking-widest text-sm">
          <Building size={18}/> <span>Historial Profesional y Educación</span>
        </div>

        {/* Aquí se añadirían subformularios complejos para WorkExperience y Education */}
        <p className="text-sm text-gray-500 italic bg-amber-50 p-4 rounded-xl border border-amber-100">
          Nota: Los historiales se gestionan con sus propios nodos y propiedades temporales (desde/hasta).
          Para efectos de este prototipo, se asume el llenado de los campos definidos en el schema.
        </p>
      </section>

      <div className="pt-8">
        <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 uppercase tracking-widest">
          Generar Perfil de Grafo
        </button>
      </div>
    </form>
  );
};

export default PersonForm;
