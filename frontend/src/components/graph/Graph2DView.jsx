import React, { useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const Graph2DView = ({ data, onNodeClick }) => {
  const fgRef = useRef();

  const getLinkColor = (link) => {
    switch(link.label) {
      case 'amigo': return '#4F46E5';
      case 'familiar': return '#10B981';
      case 'compañero_trabajo': return '#F59E0B';
      case 'pareja': return '#EF4444';
      default: return '#9CA3AF';
    }
  };

  return (
    <div className="w-full h-[600px] border border-gray-100 rounded-2xl overflow-hidden shadow-inner bg-gray-50 relative">
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        nodeLabel="label"
        nodeAutoColorBy="group"
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        linkColor={getLinkColor}
        linkLabel="label"
        onNodeClick={onNodeClick}
        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
      />
      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur p-3 rounded-lg text-xs space-y-1 shadow-sm border border-white/50">
        <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-[#4F46E5]"></span><span>Amigo</span></div>
        <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-[#10B981]"></span><span>Familiar</span></div>
        <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-[#F59E0B]"></span><span>Compañero</span></div>
        <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-[#EF4444]"></span><span>Pareja</span></div>
      </div>
    </div>
  );
};

export default Graph2DView;
