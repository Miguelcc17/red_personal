import client from './client';

export const getPersons = () => client.get('/persons').then(res => res.data.data);
export const getPerson = (id) => client.get(`/persons/${id}`).then(res => res.data.data);
export const createPerson = (data) => client.post('/persons', data).then(res => res.data.data);
export const updatePerson = (id, data) => client.put(`/persons/${id}`, data).then(res => res.data.data);
export const deletePerson = (id) => client.delete(`/persons/${id}`).then(res => res.data.data);
