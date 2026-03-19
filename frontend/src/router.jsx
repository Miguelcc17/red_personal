import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PersonsPage from './pages/PersonsPage';
import RelationshipsPage from './pages/RelationshipsPage';
import Network2DPage from './pages/Network2DPage';
import Network3DPage from './pages/Network3DPage';

const router = createBrowserRouter([
  { path: '/', element: <Dashboard /> },
  { path: '/persons', element: <PersonsPage /> },
  { path: '/relationships', element: <RelationshipsPage /> },
  { path: '/network-2d', element: <Network2DPage /> },
  { path: '/network-3d', element: <Network3DPage /> },
]);

export default router;
