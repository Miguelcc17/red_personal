import React, { useState, useEffect } from 'react';
import { createPerson, updatePerson } from '../../api/personsApi';
import { Plus, Trash2, Hash, MapPin, Briefcase, Star, Building, Target, Globe, Save, X } from 'lucide-react';

const PersonForm = ({ onCreated, initialData, onCancel }) => {
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

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        hobbies: initialData.hobbies || [],
        historial_trabajos: initialData.historial_trabajos || [],
        valores_fundamentales: initialData.valores_fundamentales || [],
        idiomas: initialData.idiomas || [],
        educacion: initialData.educacion || [],
        metas: initialData.metas || []
      });
    }
  }, [initialData]);

  const [inputState, setInputState] = useState({
    hobby: '', skill: '', spec: '', lang: '', langLevel: 'B1',
    value: '', stress: '', motiv: '', color: '',
    jobComp: '', jobRole: '', jobDesde: '', jobHasta: '', jobActual: false
  });

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
    if (typeof value === 'string' ? value.trim() : true) {
      setFormData({
        ...formData,
        [field]: [...formData[field], typeof value === 'string' ? (Object.keys(extras).length ? { nombre: value, ...extras } : value) : value]
      });
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
      if (initialData?.id) {
        await updatePerson(initialData.id, formData);
      } else {
        await createPerson(formData);
      }
      onCreated();
    } catch (err) {
      console.error(err);
      alert('Error saving person.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 bg-white p-12 rounded-3xl border border-slate-200 shadow-2xl mb-16 max-w-6xl mx-auto overflow-hidden text-slate-900 animate-in fade-in duration-500">
      <div className="flex justify-between items-start border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            {initialData ? 'Editar Perfil Analítico' : 'Nuevo Perfil de Análisis'}
          </h2>
          <p className="text-slate-500 mt-2 text-lg font-medium">Gestiona los metadatos y la trayectoria en el grafo.</p>
        </div>
        {onCancel && (
          <button type="button" onClick={onCancel} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 rounded-xl transition-colors">
            <X size={24} />
          </button>
        )}
      </div>

      <section className="space-y-6">
        <div className="flex items-center space-x-3 text-indigo-700 font-black uppercase tracking-widest text-xs">
          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center"><Hash size={16}/></div>
          <span>Identidad y Contacto</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input name="nombre" value={formData.nombre} placeholder="Nombre" onChange={handleChange} required className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-indigo-500 text-slate-900 outline-none transition-all bg-white shadow-sm" />
          <input name="apellido" value={formData.apellido} placeholder="Apellido" onChange={handleChange} required className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-indigo-500 text-slate-900 outline-none transition-all bg-white shadow-sm" />
          <input name="fecha_nacimiento" value={formData.fecha_nacimiento} type="date" onChange={handleChange} className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-indigo-500 text-slate-900 outline-none transition-all bg-white shadow-sm" />
          <input name="email" value={formData.email} type="email" placeholder="Email" onChange={handleChange} required className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-indigo-500 text-slate-900 outline-none transition-all bg-white shadow-sm" />
          <input name="telefono" value={formData.telefono} placeholder="Teléfono" onChange={handleChange} required className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-indigo-500 text-slate-900 outline-none transition-all bg-white shadow-sm" />
          <select name="genero" value={formData.genero} onChange={handleChange} className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-indigo-500 text-slate-900 outline-none transition-all bg-white shadow-sm">
            <option value="">Género...</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center space-x-3 text-indigo-700 font-black uppercase tracking-widest text-xs">
          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center"><Briefcase size={16}/></div>
          <span>Trayectoria Profesional</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input name="profesion" value={formData.profesion} placeholder="Profesión" onChange={handleChange} className="border-2 border-slate-200 p-3 rounded-xl bg-white text-slate-900 outline-none shadow-sm" />
          <input name="rol_actual" value={formData.rol_actual} placeholder="Rol Actual" onChange={handleChange} className="border-2 border-slate-200 p-3 rounded-xl bg-white text-slate-900 outline-none shadow-sm" />
          <select name="modelo_trabajo" value={formData.modelo_trabajo} onChange={handleChange} className="border-2 border-slate-200 p-3 rounded-xl bg-white text-slate-900 outline-none shadow-sm appearance-none cursor-pointer">
            <option value="remoto">Remoto</option>
            <option value="hibrido">Híbrido</option>
            <option value="presencial">Presencial</option>
          </select>
        </div>
      </section>

      <div className="pt-10 border-t border-slate-100">
        <button type="submit" className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-2xl uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-4">
          <Save size={28} />
          <span>{initialData ? 'Actualizar Perfil' : 'Generar Perfil Analítico'}</span>
        </button>
      </div>
    </form>
  );
};

export default PersonForm;
