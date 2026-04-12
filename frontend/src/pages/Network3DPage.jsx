import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { useGraphData } from '../hooks/useGraph';
import Graph3DView from '../components/graph/Graph3DView';
import NodeDetailsPanel from '../components/graph/NodeDetailsPanel';
import LinkDetailsPanel from '../components/graph/LinkDetailsPanel';
import Loader from '../components/common/Loader';
import { Box, Command } from 'lucide-react';

const Network3DPage = () => {
  const { graphData, loading } = useGraphData();
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);

  if (loading) return (
    <div className="flex bg-slate-950 min-h-screen">
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
    <div className="flex bg-slate-950 min-h-screen overflow-hidden">
      <Navbar />

      <main className="flex-1 ml-72 relative flex flex-col h-screen">
        <div className="absolute top-8 left-8 z-30 pointer-events-none">
           <div className="flex items-center space-x-3 bg-slate-900/60 backdrop-blur-2xl px-6 py-3 rounded-2xl border border-slate-800 shadow-2xl shadow-black/50">
              <Box className="text-indigo-400" size={20} />
              <h1 className="text-sm font-black uppercase tracking-[0.2em] text-white">Visualización Neuronal 3D</h1>
           </div>
        </div>

        <div className="flex-1 w-full h-full">
           <Graph3DView
             data={graphData}
             onNodeClick={handleNodeClick}
             onLinkClick={handleLinkClick}
           />
        </div>

        {!selectedNode && !selectedLink && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
             <div className="flex items-center space-x-3 bg-indigo-500/10 backdrop-blur-xl px-8 py-3 rounded-full border border-indigo-500/20">
                <Command className="text-indigo-400" size={16} />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Explora nodos y vínculos</p>
             </div>
          </div>
        )}

        <NodeDetailsPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
        <LinkDetailsPanel link={selectedLink} onClose={() => setSelectedLink(null)} />
      </main>
    </div>
  );
};

export default Network3DPage;
