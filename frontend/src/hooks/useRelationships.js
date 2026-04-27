import { useState, useEffect, useCallback } from 'react';
import { getRelationships } from '../api/relationshipsApi';

export const useRelationships = () => {
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ⚡ Bolt: Memoize fetch function to prevent unnecessary recreation on every render.
  // This ensures stable reference for consumers, preventing child component re-renders
  // when this function is passed down as a prop.
  const fetchRelationships = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getRelationships();
      setRelationships(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRelationships();
  }, [fetchRelationships]);

  return { relationships, loading, error, fetchRelationships };
};
