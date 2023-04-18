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
          <img
            width={292}
            height={118}
            className="logo"
            src={`${CDN_URL}/images/trustless-logo-1.svg`}
            alt="trustless computer logo"
          />
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
