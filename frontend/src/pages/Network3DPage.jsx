import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { useGraphData } from '../hooks/useGraph';
import Graph3DView from '../components/graph/Graph3DView';
import NodeDetailsPanel from '../components/graph/NodeDetailsPanel';
import Loader from '../components/common/Loader';
import { Box, Expand } from 'lucide-react';

const Network3DPage = () => {
  const { graphData, loading } = useGraphData();
  const [selectedNode, setSelectedNode] = useState(null);

  if (loading) return <PageContainer title="Red 3D"><Loader /></PageContainer>;

  return (
    <div className="flex bg-slate-950 min-h-screen">
      {/* Sidebar logic is in PageContainer, but we want full screen here */}
      <PageContainer title="Visualización Neuronal 3D">
        <div className="relative h-[calc(100vh-12rem)] w-full">
          <Graph3DView data={graphData} onNodeClick={(node) => setSelectedNode(node)} />

          {/* Overlays are handled within Graph3DView and here */}
          <NodeDetailsPanel node={selectedNode} onClose={() => setSelectedNode(null)} />

          {!selectedNode && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
               <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/20 mb-4 animate-pulse">
                  <Box className="text-indigo-400" size={40} />
               </div>
               <p className="text-slate-600 text-xs font-black uppercase tracking-widest">Selecciona un nodo para analizar</p>
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
};

export default Network3DPage;
