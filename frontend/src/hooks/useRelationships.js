import { useState, useEffect } from 'react';
import { getRelationships } from '../api/relationshipsApi';

export const useRelationships = () => {
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRelationships = async () => {
    try {
      setLoading(true);
      const data = await getRelationships();
      setRelationships(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelationships();
  }, []);

  return { relationships, loading, error, fetchRelationships };
};
