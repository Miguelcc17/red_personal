import React from 'react';
import ForceGraph3D from 'react-force-graph-3d';

const Graph3DView = React.memo(({ data, onNodeClick, onLinkClick }) => {
  return (
    <div className="w-full h-full relative group">
      <ForceGraph3D
        graphData={data}
        nodeLabel="label"
        nodeAutoColorBy="group"
        nodeRelSize={7}
        linkDirectionalArrowLength={4}
        linkDirectionalArrowRelPos={1}
        linkColor={() => 'rgba(255,255,255,0.15)'}
        linkOpacity={0.3}
        onNodeClick={onNodeClick}
        onLinkClick={onLinkClick}
        backgroundColor="#020617"
        showNavInfo={false}
        controlType="orbit"
        enableNodeDrag={true}
      />

      <div className="absolute bottom-10 left-10 bg-slate-900/40 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/5 text-slate-400 text-[10px] uppercase font-black tracking-widest space-y-3 pointer-events-none group-hover:opacity-100 transition-opacity duration-700 shadow-2xl">
         <p className="text-indigo-400 mb-2 border-b border-indigo-500/20 pb-2">Navegación 3D</p>
         <div className="flex items-center space-x-3"><span className="w-2 h-2 bg-indigo-500 rounded-full"/> <span>Rotar: Click Izquierdo</span></div>
         <div className="flex items-center space-x-3"><span className="w-2 h-2 bg-indigo-500 rounded-full"/> <span>Zoom: Scroll</span></div>
         <div className="flex items-center space-x-3"><span className="w-2 h-2 bg-indigo-500 rounded-full"/> <span>Mover: Click Derecho</span></div>
      </div>

      <div className="absolute top-24 left-8 bg-indigo-600/20 backdrop-blur-md px-6 py-2 rounded-full border border-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">
         Red Neuronal Activa
      </div>
    </div>
  );
});

export default Graph3DView;
