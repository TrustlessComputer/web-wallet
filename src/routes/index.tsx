import React from 'react';
import { RouteObject } from 'react-router-dom';
import Layout from '@/pages/layout';
import NotFound from '@/pages/404';
import Wallet from '@/pages/wallet';
import { ROUTE_PATH } from '@/constants/route-path';
import ConnectWallet from '@/pages/connect-wallet';

export default [
  {
    path: ROUTE_PATH.NOT_FOUND,
    element: <Layout />,
    children: [{ index: true, element: <NotFound /> }],
  },
  {
    path: ROUTE_PATH.WALLET,
    element: <Layout />,
    children: [{ index: true, element: <Wallet /> }],
  },
  {
    path: ROUTE_PATH.CONNECT_WALLET,
    element: <ConnectWallet />,
  },
] as RouteObject[];
