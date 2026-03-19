import { useState, useEffect } from 'react';
import { getGraph } from '../api/graphApi';

export const useGraphData = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGraph = async () => {
    try {
      setLoading(true);
      const data = await getGraph();
      setGraphData(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  return { graphData, loading, error, fetchGraph };
};
