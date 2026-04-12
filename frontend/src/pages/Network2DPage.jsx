import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { useGraphData } from '../hooks/useGraph';
import Graph2DView from '../components/graph/Graph2DView';
import NodeDetailsPanel from '../components/graph/NodeDetailsPanel';
import Loader from '../components/common/Loader';
import { Network, MousePointer2 } from 'lucide-react';

const Network2DPage = () => {
  const { graphData, loading } = useGraphData();
  const [selectedNode, setSelectedNode] = useState(null);

  if (loading) return (
    <div className="flex bg-slate-50 min-h-screen">
      <Navbar />
      <div className="flex-1 ml-72 flex items-center justify-center"><Loader /></div>
    </div>
  );

  return (
    <div className="flex bg-white min-h-screen overflow-hidden">
      <Navbar />

      <main className="flex-1 ml-72 relative flex flex-col h-screen">
        {/* Header Overlay */}
        <div className="absolute top-8 left-8 z-30 pointer-events-none">
           <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-xl px-6 py-3 rounded-2xl border border-slate-200 shadow-xl">
              <Network className="text-indigo-600" size={20} />
              <h1 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Mapa de Red 2D</h1>
           </div>
        </div>

        {/* Graph Component - Occupies Full Available Area */}
        <div className="flex-1 w-full h-full">
           <Graph2DView data={graphData} onNodeClick={(node) => setSelectedNode(node)} />
        </div>

        {/* Selection Hint */}
        {!selectedNode && (
          <div className="absolute bottom-8 left-8 z-30 pointer-events-none">
             <div className="flex items-center space-x-3 bg-slate-900/10 backdrop-blur-md px-5 py-2 rounded-full border border-slate-900/5">
                <MousePointer2 className="text-slate-400" size={14} />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Selecciona un nodo para analizar</p>
             </div>
          </div>
        )}

        {/* Details Side Drawer */}
        <NodeDetailsPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
      </main>
    </div>
  );
};

export default Network2DPage;
