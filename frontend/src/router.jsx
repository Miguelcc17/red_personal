import React, { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Loader from './components/common/Loader';

// ⚡ Bolt: Dynamically import route components to implement code splitting.
// This reduces the initial JS bundle size and defers loading of non-critical code until the route is visited.
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const PersonsPage = React.lazy(() => import('./pages/PersonsPage'));
const RelationshipsPage = React.lazy(() => import('./pages/RelationshipsPage'));
const Network2DPage = React.lazy(() => import('./pages/Network2DPage'));
const Network3DPage = React.lazy(() => import('./pages/Network3DPage'));

const withSuspense = (Component) => (
  <Suspense fallback={<div className="flex bg-slate-50 min-h-screen items-center justify-center w-full"><Loader /></div>}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  { path: '/', element: withSuspense(Dashboard) },
  { path: '/persons', element: withSuspense(PersonsPage) },
  { path: '/relationships', element: withSuspense(RelationshipsPage) },
  { path: '/network-2d', element: withSuspense(Network2DPage) },
  { path: '/network-3d', element: withSuspense(Network3DPage) },
]);

export default router;
