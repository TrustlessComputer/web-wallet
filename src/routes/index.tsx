import React from 'react';
import { RouteObject } from 'react-router-dom';
import Layout from '@/pages/layout';
import NotFound from '@/pages/404';
import { ROUTE_PATH } from '@/constants/route-path';
import Home from '@/pages/home';

export default [
  {
    path: ROUTE_PATH.NOT_FOUND,
    element: <Layout />,
    children: [{ index: true, element: <NotFound /> }],
  },
  {
    path: ROUTE_PATH.HOME,
    element: <Layout />,
    children: [{ index: true, element: <Home /> }],
  },
] as RouteObject[];
