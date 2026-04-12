import React, { useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const Graph2DView = ({ data, onNodeClick }) => {
  const fgRef = useRef();

  const getLinkColor = (link) => {
    switch(link.label) {
      case 'amigo': return '#6366f1'; // Indigo 500
      case 'familiar': return '#10b981'; // Emerald 500
      case 'compañero_trabajo': return '#f59e0b'; // Amber 500
      case 'pareja': return '#ef4444'; // Red 500
      default: return '#cbd5e1'; // Slate 300
    }
  };

  return (
    <div className="w-full h-full bg-slate-50 relative">
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        nodeLabel="label"
        nodeAutoColorBy="group"
        nodeRelSize={7}
        linkDirectionalArrowLength={4}
        linkDirectionalArrowRelPos={1}
        linkWidth={2}
        linkColor={getLinkColor}
        linkLabel="label"
        onNodeClick={onNodeClick}
        cooldownTicks={100}
        d3AlphaDecay={0.03}
        d3VelocityDecay={0.3}
      />

      {/* minimalist Legend */}
      <div className="absolute top-24 left-8 bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-slate-200 shadow-xl space-y-2">
        <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Leyenda de Relación</p>
        <div className="flex items-center space-x-3"><span className="w-2.5 h-2.5 rounded-full bg-[#6366f1]"/> <span className="text-[10px] font-bold text-slate-600 uppercase">Amigo</span></div>
        <div className="flex items-center space-x-3"><span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"/> <span className="text-[10px] font-bold text-slate-600 uppercase">Familiar</span></div>
        <div className="flex items-center space-x-3"><span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"/> <span className="text-[10px] font-bold text-slate-600 uppercase">Colega</span></div>
        <div className="flex items-center space-x-3"><span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"/> <span className="text-[10px] font-bold text-slate-600 uppercase">Pareja</span></div>
      </div>
    </div>
  );
};

export default Graph2DView;
