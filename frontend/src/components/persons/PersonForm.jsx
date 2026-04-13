import React, { useState, useEffect } from 'react';
import { createPerson, updatePerson } from '../../api/personsApi';
import { Plus, Trash2, Hash, MapPin, Briefcase, Star, Building, Target, Globe, Save, X, Loader2 } from 'lucide-react';

const PersonForm = ({ onCreated, initialData, onCancel }) => {
  const [loading, setLoading] = useState(false);
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
        metas: initialData.metas || [],
        tatuajes: initialData.tatuajes || { tiene_tatuajes: false, descripcion: '', estilo: '', significado: '', cantidad: 0 }
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
    setLoading(true);
    try {
      // Create clean payload (remove elementId and other read-only technical fields)
      const { id, created_at, updated_at, nombre_completo, edad, ...cleanPayload } = formData;

      if (initialData?.id) {
        await updatePerson(initialData.id, cleanPayload);
      } else {
        await createPerson(cleanPayload);
      }
      onCreated();
    } catch (err) {
      console.error(err);
      alert('Error al guardar el perfil. Por favor, revisa la consola.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-12 bg-white p-12 rounded-[3rem] border-2 border-slate-100 shadow-2xl mb-16 max-w-6xl mx-auto overflow-hidden text-slate-900 transition-all ${loading ? 'opacity-50 pointer-events-none scale-95' : 'opacity-100 scale-100'}`}>
      <div className="flex justify-between items-start border-b border-slate-50 pb-8">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            {initialData ? 'Editar Perfil Analítico' : 'Nuevo Perfil de Análisis'}
          </h2>
          <p className="text-slate-500 mt-2 text-lg font-medium italic">Sincronización directa con el grafo de red.</p>
        </div>
        {onCancel && (
          <button type="button" onClick={onCancel} className="p-3 text-slate-400 hover:text-red-500 bg-slate-50 rounded-2xl transition-all">
            <X size={28} />
          </button>
        )}
      </div>

      {/* Identidad */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 text-indigo-700 font-black uppercase tracking-widest text-xs">
          <Hash size={20}/> <span>Identidad Base</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre</label>
            <input name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full border-2 border-slate-100 p-4 rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Apellido</label>
            <input name="apellido" value={formData.apellido} onChange={handleChange} required className="w-full border-2 border-slate-100 p-4 rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
            <input name="email" value={formData.email} type="email" onChange={handleChange} required className="w-full border-2 border-slate-100 p-4 rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold" />
          </div>
        </div>
      </section>

      {/* Trajectory */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 text-indigo-700 font-black uppercase tracking-widest text-xs">
          <Briefcase size={20}/> <span>Trayectoria Profesional</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <input name="profesion" value={formData.profesion} placeholder="Profesión Principal" onChange={handleChange} className="border-2 border-slate-100 p-4 rounded-2xl font-bold" />
          <input name="rol_actual" value={formData.rol_actual} placeholder="Rol Actual" onChange={handleChange} className="border-2 border-slate-100 p-4 rounded-2xl font-bold" />
          <select name="modelo_trabajo" value={formData.modelo_trabajo} onChange={handleChange} className="border-2 border-slate-100 p-4 rounded-2xl font-bold bg-white text-slate-900 cursor-pointer outline-none focus:border-indigo-500">
            <option value="remoto">Remoto</option>
            <option value="hibrido">Híbrido</option>
            <option value="presencial">Presencial</option>
            <option value="freelance">Freelance</option>
            <option value="in_house">In House</option>
            <option value="emprendedor">Emprendedor</option>
          </select>
        </div>
      </section>

      <div className="pt-10 border-t border-slate-50">
        <button type="submit" className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black text-2xl uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 flex items-center justify-center space-x-4">
          {loading ? <Loader2 className="animate-spin" size={32} /> : <Save size={32} />}
          <span>{initialData ? 'Actualizar Cambios en el Grafo' : 'Confirmar Generación de Perfil'}</span>
        </button>
      </div>
    </form>
  );
};

export default PersonForm;
