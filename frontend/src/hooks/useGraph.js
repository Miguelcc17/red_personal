import { useState, useEffect, useCallback } from 'react';
import { getGraph } from '../api/graphApi';

export const useGraphData = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ⚡ Bolt: Memoize fetch function to prevent unnecessary recreation on every render.
  // This ensures stable reference for consumers, preventing child component re-renders
  // when this function is passed down as a prop.
  const fetchGraph = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getGraph();
      setGraphData(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  return { graphData, loading, error, fetchGraph };
};
