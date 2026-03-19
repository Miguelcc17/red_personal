import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { useGraphData } from '../hooks/useGraph';
import Graph3DView from '../components/graph/Graph3DView';
import NodeDetailsPanel from '../components/graph/NodeDetailsPanel';
import Loader from '../components/common/Loader';

const Network3DPage = () => {
  const { graphData, loading } = useGraphData();
  const [selectedNode, setSelectedNode] = useState(null);

  if (loading) return <PageContainer title="3D Network"><Loader /></PageContainer>;

  return (
    <PageContainer title="3D Network Visualization">
      <div className="relative">
        <Graph3DView data={graphData} onNodeClick={(node) => setSelectedNode(node)} />
        <NodeDetailsPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
      </div>
    </PageContainer>
  );
};

export default Network3DPage;
