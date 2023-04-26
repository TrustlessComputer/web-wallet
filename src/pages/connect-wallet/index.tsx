import React, { useContext, useState } from 'react';
import { Wrapper, ConnectWalletButton } from './ConnectWallet.styled';
import { CDN_URL } from '@/configs';
import { Container } from '../layout';
import { ConnectContext } from '@/contexts/connect-context';

const ConnectWallet: React.FC = (): React.ReactElement => {
  const { onConnect } = useContext(ConnectContext);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      await onConnect();
    } catch (err) {
      // await onDisconnect();
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Container>
      <Wrapper>
        <div className="content">
          <img alt="logo banner" src={`${CDN_URL}/icons/wallet_logo.svg`} className="logo" width={120} height={120} />
          <h1 className="title">
            Trustless Computer is an open-source protocol that powers decentralized applications on Bitcoin.
          </h1>
          <ConnectWalletButton bg="btn3" disabled={isConnecting} onClick={handleConnectWallet}>
            {isConnecting ? 'Connecting...' : 'Connect wallet'}
          </ConnectWalletButton>
        </div>
      </Wrapper>
    </Container>
  );
};

export default ConnectWallet;
