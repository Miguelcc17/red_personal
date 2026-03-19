import client from './client';

export const getGraph = () => client.get('/graph').then(res => res.data.data);
export const getPersonGraph = (id) => client.get(`/graph/person/${id}`).then(res => res.data.data);
