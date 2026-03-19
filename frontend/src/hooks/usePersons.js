import { useState, useEffect } from 'react';
import { getPersons } from '../api/personsApi';

export const usePersons = () => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPersons = async () => {
    try {
      setLoading(true);
      const data = await getPersons();
      setPersons(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  return { persons, loading, error, fetchPersons };
};
