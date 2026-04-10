import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import { usePersons } from '../hooks/usePersons';
import { useRelationships } from '../hooks/useRelationships';
import { useGraphData } from '../hooks/useGraph';
import Loader from '../components/common/Loader';
import { Users, Share2, Network, Database } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { persons, loading: pLoading, fetchPersons } = usePersons();
  const { relationships, loading: rLoading, fetchRelationships } = useRelationships();
  const { graphData, loading: gLoading, fetchGraph } = useGraphData();

  const handleSeed = async () => {
    if (window.confirm('¿Deseas poblar la base de datos con datos de ejemplo?')) {
      try {
        // We use a dedicated seed endpoint if available, or just log
        alert('Cargando datos de ejemplo... Por favor asegúrate de que el backend tiene el script de seed configurado.');
        // In a real app, we might have a POST /api/seed
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (pLoading || rLoading || gLoading) return <PageContainer title="Dashboard"><Loader /></PageContainer>;

  const stats = [
    { label: 'Personas en Red', value: persons.length, icon: <Users className="text-blue-500" /> },
    { label: 'Relaciones Totales', value: relationships.length, icon: <Share2 className="text-green-500" /> },
    { label: 'Nodos en Grafo', value: graphData.nodes.length, icon: <Network className="text-purple-500" /> },
  ];

  return (
    <PageContainer title="Análisis de Red Personal">
      <div className="flex justify-end mb-8">
         <button onClick={()=>{ fetchPersons(); fetchRelationships(); fetchGraph(); }} className="bg-white text-indigo-600 border border-indigo-100 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-50 transition-all mr-2">
           Actualizar Datos
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-gray-50 shadow-sm flex items-center space-x-6 hover:shadow-xl hover:shadow-indigo-50/50 transition-all group">
            <div className="p-4 bg-gray-50 rounded-2xl group-hover:scale-110 transition-transform">{stat.icon}</div>
            <div>
              <p className="text-xs text-gray-400 font-black uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-3xl font-black text-gray-900 mt-1">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 p-10 rounded-[2.5rem] flex flex-col justify-between shadow-2xl shadow-indigo-200">
          <div>
            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Análisis Predictivo y de Comportamiento</h3>
            <p className="text-indigo-100 mb-8 leading-relaxed opacity-80">Explora las conexiones dinámicas y las trayectorias de los individuos en tu red profesional. Nuestra arquitectura de grafos permite un análisis profundo basado en historia y afinidad.</p>
          </div>
          <div className="flex space-x-4">
            <button onClick={() => window.location.href='/network-2d'} className="bg-white text-indigo-900 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-lg">
              Ver Mapa 2D
            </button>
            <button onClick={() => window.location.href='/network-3d'} className="bg-indigo-500 text-white border border-indigo-400 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-400 transition-all">
              Red Neuronal 3D
            </button>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-gray-800 mb-6 uppercase tracking-tight">Individuos Recientes</h3>
          <div className="space-y-4">
            {persons.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-50 group hover:bg-white hover:shadow-lg transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold uppercase">{p.nombre[0]}</div>
                  <div>
                    <span className="font-black text-gray-700 block text-sm">{p.nombre} {p.apellido}</span>
                    <span className="text-[10px] text-indigo-400 font-black uppercase tracking-tighter">{p.profesion || 'Analista'}</span>
                  </div>
                </div>
                <div className="text-[10px] text-gray-300 font-bold">{p.ciudad_residencia || 'SCL'}</div>
              </div>
            ))}
            {persons.length === 0 && <p className="text-gray-400 text-center py-10 italic font-medium">No hay individuos registrados aún.</p>}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
