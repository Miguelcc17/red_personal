import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import { usePersons } from '../hooks/usePersons';
import { useRelationships } from '../hooks/useRelationships';
import { useGraphData } from '../hooks/useGraph';
import Loader from '../components/common/Loader';
import { Users, Share2, Network } from 'lucide-react';

const Dashboard = () => {
  const { persons, loading: pLoading } = usePersons();
  const { relationships, loading: rLoading } = useRelationships();
  const { graphData, loading: gLoading } = useGraphData();

  if (pLoading || rLoading || gLoading) return <PageContainer title="Dashboard"><Loader /></PageContainer>;

  const stats = [
    { label: 'Total Persons', value: persons.length, icon: <Users className="text-blue-500" /> },
    { label: 'Total Relationships', value: relationships.length, icon: <Share2 className="text-green-500" /> },
    { label: 'Connected Nodes', value: graphData.nodes.length, icon: <Network className="text-purple-500" /> },
  ];

  return (
    <PageContainer title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-gray-50 rounded-lg">{stat.icon}</div>
            <div>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
              <h4 className="text-2xl font-bold text-gray-900">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-indigo-50 p-8 rounded-2xl flex flex-col justify-between">
          <h3 className="text-xl font-bold text-indigo-900 mb-4">Quick Insights</h3>
          <p className="text-indigo-700 mb-6">Explore the social fabric of your network. Manage persons and discover how they connect.</p>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium self-start hover:bg-indigo-700 transition-colors">
            View Map
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Recent Persons</h3>
          <div className="space-y-2">
            {persons.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="font-medium text-gray-700">{p.nombre} {p.apellido}</span>
                <span className="text-xs text-indigo-500 font-bold uppercase">{p.profesion}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
