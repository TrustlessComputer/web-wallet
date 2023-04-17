import React from 'react';
import Wallet from '@/pages/wallet';
import ConnectWallet from '@/pages/connect-wallet';
import { useCurrentUser } from '@/state/user/hooks';

const Home = React.memo(() => {
  const user = useCurrentUser();

  if (!user) return <ConnectWallet />;

  return <Wallet />;
});

export default Home;
