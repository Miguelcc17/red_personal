import React from 'react';
import ForceGraph3D from 'react-force-graph-3d';

const Graph3DView = ({ data, onNodeClick }) => {
  return (
    <div className="w-full h-full min-h-[700px] border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl bg-slate-950 relative group">
      <ForceGraph3D
        graphData={data}
        nodeLabel="label"
        nodeAutoColorBy="group"
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        linkColor={() => 'rgba(255,255,255,0.15)'}
        linkOpacity={0.2}
        onNodeClick={onNodeClick}
        backgroundColor="#020617"
        showNavInfo={false}
        controlType="orbit"
        enableNodeDrag={true}
      />

      {/* 3D Navigation Guide Overlay */}
      <div className="absolute bottom-10 left-10 bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-700/50 text-slate-400 text-[10px] uppercase font-black tracking-widest space-y-3 pointer-events-none group-hover:opacity-100 transition-opacity duration-500 shadow-2xl">
         <p className="text-indigo-400 mb-2 border-b border-indigo-400/20 pb-1">Controles 3D</p>
         <div className="flex items-center space-x-3"><span className="w-2 h-2 bg-indigo-500 rounded-full"/> <span>Rotar: Click Izquierdo</span></div>
         <div className="flex items-center space-x-3"><span className="w-2 h-2 bg-indigo-500 rounded-full"/> <span>Zoom: Scroll Mouse</span></div>
         <div className="flex items-center space-x-3"><span className="w-2 h-2 bg-indigo-500 rounded-full"/> <span>Mover: Click Derecho</span></div>
      </div>

      <div className="absolute top-10 left-10 bg-indigo-600/20 backdrop-blur-md px-6 py-2 rounded-full border border-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em]">
         Red Neuronal Activa
      </div>
    </div>
  );
};

export default Graph3DView;
