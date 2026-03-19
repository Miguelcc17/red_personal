import React from 'react';
import ForceGraph3D from 'react-force-graph-3d';

const Graph3DView = ({ data, onNodeClick }) => {
  return (
    <div className="w-full h-[600px] border border-gray-100 rounded-2xl overflow-hidden shadow-2xl bg-slate-900">
      <ForceGraph3D
        graphData={data}
        nodeLabel="label"
        nodeAutoColorBy="group"
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        linkColor={() => 'rgba(255,255,255,0.2)'}
        linkOpacity={0.3}
        onNodeClick={onNodeClick}
        backgroundColor="#0f172a"
        showNavInfo={true}
        controlType="orbit"
      />
    </div>
  );
};

export default Graph3DView;
