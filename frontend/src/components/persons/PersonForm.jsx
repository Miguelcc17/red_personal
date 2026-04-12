import React, { useState } from 'react';
import { createPerson } from '../../api/personsApi';
import { Plus, Trash2, Hash, MapPin, Briefcase, Star, Building, Target, Globe } from 'lucide-react';

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

  const [inputState, setInputState] = useState({
    hobby: '', skill: '', spec: '', lang: '', langLevel: 'B1',
    value: '', stress: '', motiv: '', color: '',
    jobComp: '', jobRole: '', jobDesde: '', jobHasta: '', jobActual: false,
    eduInst: '', eduTitle: '', eduDesde: '', eduHasta: '', eduActual: false,
    goalType: 'personal', goalDesc: '', goalDesde: '', goalHasta: ''
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
      await createPerson(formData);
      onCreated();
    } catch (err) {
      console.error(err);
      alert('Error al crear persona. Ver consola.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 bg-white p-12 rounded-3xl border border-gray-200 shadow-2xl mb-16 max-w-6xl mx-auto overflow-hidden text-slate-900">
      <div className="border-b border-gray-100 pb-6">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Nuevo Perfil de Análisis</h2>
        <p className="text-slate-500 mt-2 text-lg font-medium">Crea una entidad en el grafo con metadatos de trayectoria y comportamiento.</p>
      </div>

      {/* 1. Identidad Base */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 text-indigo-700 font-black uppercase tracking-widest text-xs">
          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center"><Hash size={16}/></div>
          <span>Identidad y Contacto</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase ml-1">Nombre</label>
            <input name="nombre" placeholder="Juan" onChange={handleChange} required className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-indigo-500 text-slate-900 outline-none transition-all bg-white shadow-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase ml-1">Apellido</label>
            <input name="apellido" placeholder="Pérez" onChange={handleChange} required className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-indigo-500 text-slate-900 outline-none transition-all bg-white shadow-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase ml-1">Fecha Nacimiento</label>
            <input name="fecha_nacimiento" type="date" onChange={handleChange} className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-indigo-500 text-slate-900 outline-none transition-all bg-white shadow-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase ml-1">Email Principal</label>
            <input name="email" type="email" placeholder="correo@ejemplo.com" onChange={handleChange} required className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-indigo-500 text-slate-900 outline-none transition-all bg-white shadow-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase ml-1">Teléfono</label>
            <input name="telefono" placeholder="+56 9..." onChange={handleChange} required className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-indigo-500 text-slate-900 outline-none transition-all bg-white shadow-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase ml-1">Género</label>
            <select name="genero" onChange={handleChange} className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-indigo-500 text-slate-900 outline-none transition-all bg-white shadow-sm appearance-none cursor-pointer">
              <option value="">Seleccionar...</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>
      </section>

      {/* 2. Ubicación */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 text-indigo-700 font-black uppercase tracking-widest text-xs">
          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center"><MapPin size={16}/></div>
          <span>Localización Geográfica</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
            <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-tighter">Origen (BORN_IN)</p>
            <div className="grid grid-cols-2 gap-4">
              <input name="ciudad_nacimiento" placeholder="Ciudad" onChange={handleChange} className="bg-white border-2 border-slate-200 p-3 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100" />
              <input name="pais_nacimiento" placeholder="País" onChange={handleChange} className="bg-white border-2 border-slate-200 p-3 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100" />
            </div>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
            <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-tighter">Residencia Actual (LIVES_IN)</p>
            <div className="grid grid-cols-2 gap-4">
              <input name="ciudad_residencia" placeholder="Ciudad" onChange={handleChange} className="bg-white border-2 border-slate-200 p-3 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100" />
              <input name="pais_residencia" placeholder="País" onChange={handleChange} className="bg-white border-2 border-slate-200 p-3 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Profesional */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 text-indigo-700 font-black uppercase tracking-widest text-xs">
          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center"><Briefcase size={16}/></div>
          <span>Trayectoria Profesional</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input name="profesion" placeholder="Profesión" onChange={handleChange} className="border-2 border-slate-200 p-3 rounded-xl bg-white text-slate-900 outline-none shadow-sm" />
          <input name="rol_actual" placeholder="Rol Actual" onChange={handleChange} className="border-2 border-slate-200 p-3 rounded-xl bg-white text-slate-900 outline-none shadow-sm" />
          <select name="modelo_trabajo" value={formData.modelo_trabajo} onChange={handleChange} className="border-2 border-slate-200 p-3 rounded-xl bg-white text-slate-900 outline-none shadow-sm appearance-none cursor-pointer">
            <option value="remoto">Remoto</option>
            <option value="hibrido">Híbrido</option>
            <option value="presencial">Presencial</option>
          </select>
        </div>

        <div className="bg-indigo-50/50 p-8 rounded-3xl space-y-4 border border-indigo-100">
          <p className="text-xs font-black text-indigo-700 uppercase tracking-widest flex items-center space-x-2">
            <Building size={14}/> <span>Añadir Experiencia Laboral</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input placeholder="Empresa" value={inputState.jobComp} onChange={(e)=>setInputState({...inputState, jobComp: e.target.value})} className="bg-white border-2 border-slate-200 p-2 rounded-lg text-sm text-slate-900 outline-none" />
            <input placeholder="Cargo" value={inputState.jobRole} onChange={(e)=>setInputState({...inputState, jobRole: e.target.value})} className="bg-white border-2 border-slate-200 p-2 rounded-lg text-sm text-slate-900 outline-none" />
            <input type="date" value={inputState.jobDesde} onChange={(e)=>setInputState({...inputState, jobDesde: e.target.value})} className="bg-white border-2 border-slate-200 p-2 rounded-lg text-sm text-slate-900 outline-none" />
            <input type="date" value={inputState.jobHasta} onChange={(e)=>setInputState({...inputState, jobHasta: e.target.value})} className="bg-white border-2 border-slate-200 p-2 rounded-lg text-sm text-slate-900 outline-none" />
            <button type="button" onClick={()=>{
              addItem('historial_trabajos', { empresa: inputState.jobComp, cargo: inputState.jobRole, desde: inputState.jobDesde, hasta: inputState.jobHasta, actual: false });
              setInputState({...inputState, jobComp: '', jobRole: '', jobDesde: '', jobHasta: ''});
            }} className="bg-indigo-600 text-white rounded-lg font-bold text-xs uppercase hover:bg-indigo-700 transition-colors shadow-md">Añadir</button>
          </div>
          <div className="flex flex-wrap gap-3">
            {formData.historial_trabajos.map((j, i) => (
              <div key={i} className="bg-white px-4 py-2 rounded-xl shadow-sm border border-indigo-200 flex items-center space-x-3 text-slate-900">
                <span className="text-xs font-bold">{j.empresa} - {j.cargo}</span>
                <button type="button" onClick={()=>removeItem('historial_trabajos', i)} className="text-red-500 hover:text-red-700 transition-colors"><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Psicológico */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3 text-indigo-700 font-black uppercase tracking-widest text-xs">
          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center"><Star size={16}/></div>
          <span>Análisis Simbólico y Conductual</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
             <div className="flex space-x-2">
               <input value={inputState.value} onChange={(e)=>setInputState({...inputState, value: e.target.value})} placeholder="Valor Fundamental..." className="flex-1 border-2 border-slate-200 p-3 rounded-xl text-sm text-slate-900 outline-none focus:border-indigo-400 bg-white" />
               <button type="button" onClick={()=>addItem('valores_fundamentales', inputState.value)} className="bg-indigo-600 text-white px-4 rounded-xl hover:bg-indigo-700 shadow-md"><Plus/></button>
             </div>
             <div className="flex flex-wrap gap-2">
               {formData.valores_fundamentales.map((v, i)=>(
                 <span key={i} className="bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-indigo-200">{v}</span>
               ))}
             </div>
          </div>
          <div className="space-y-4">
             <textarea name="vision_largo_plazo" placeholder="Visión a Largo Plazo..." onChange={handleChange} className="w-full border-2 border-slate-200 p-3 rounded-2xl h-full text-sm text-slate-900 outline-none focus:border-indigo-400 bg-white shadow-inner" />
          </div>
        </div>
      </section>

      <div className="pt-10 border-t border-slate-100">
        <button type="submit" className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-2xl uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 hover:scale-[1.01] active:scale-[0.99]">
          Generar Perfil Analítico
        </button>
      </div>
    </form>
  );
};

export default PersonForm;
