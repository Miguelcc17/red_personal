import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { useGraphData } from '../hooks/useGraph';
import Graph2DView from '../components/graph/Graph2DView';
import NodeDetailsPanel from '../components/graph/NodeDetailsPanel';
import LinkDetailsPanel from '../components/graph/LinkDetailsPanel';
import Loader from '../components/common/Loader';
import { Network, MousePointer2 } from 'lucide-react';

const Network2DPage = () => {
  const { graphData, loading } = useGraphData();
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);

  if (loading) return (
    <div className="flex bg-slate-50 min-h-screen">
      <Navbar />
      <div className="flex-1 ml-72 flex items-center justify-center"><Loader /></div>
    </div>
  );

  const handleNodeClick = (node) => {
    setSelectedLink(null);
    setSelectedNode(node);
  };

  const handleLinkClick = (link) => {
    setSelectedNode(null);
    setSelectedLink(link);
  };

  return (
    <div className="flex bg-white min-h-screen overflow-hidden">
      <Navbar />

      <main className="flex-1 ml-72 relative flex flex-col h-screen">
        <div className="absolute top-8 left-8 z-30 pointer-events-none">
           <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-xl px-6 py-3 rounded-2xl border border-slate-200 shadow-xl">
              <Network className="text-indigo-600" size={20} />
              <h1 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Mapa de Red 2D</h1>
           </div>
        </div>

        <div className="flex-1 w-full h-full">
           <Graph2DView
             data={graphData}
             onNodeClick={handleNodeClick}
             onLinkClick={handleLinkClick}
           />
        </div>

        {!selectedNode && !selectedLink && (
          <div className="absolute bottom-8 left-8 z-30 pointer-events-none">
             <div className="flex items-center space-x-3 bg-slate-900/10 backdrop-blur-md px-5 py-2 rounded-full border border-slate-900/5">
                <MousePointer2 className="text-slate-400" size={14} />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Selecciona un nodo o enlace para analizar</p>
             </div>
          </div>
        )}

        <NodeDetailsPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
        <LinkDetailsPanel link={selectedLink} onClose={() => setSelectedLink(null)} />
      </main>
    </div>
  );
};

export default Network2DPage;
