import React, { useContext, useState } from 'react';
import { Wrapper, ConnectWalletButton } from './ConnectWallet.styled';
import { CDN_URL } from '@/configs';
import { Container } from '../layout';
import { ConnectContext } from '@/contexts/connect.context';

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
        <div className="header">
          <div className="socialContainer">
            <a href="https://discord.com/channels/1052411011036090458/1094649301210239086" target="_blank">
              <img alt="icon" className="icon" src={`${CDN_URL}/icons/ic-discord-18x18.svg`} />
            </a>
            <a href="https://twitter.com/DappsOnBitcoin" target="_blank">
              <img alt="icon" className="icon" src={`${CDN_URL}/icons/ic-twitter-18x18.svg`} />
            </a>
          </div>
        </div>
        <div className="mainContent">
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
          <ConnectWalletButton disabled={isConnecting} onClick={handleConnectWallet}>
            {isConnecting ? 'Connecting...' : 'Connect wallet'}
          </ConnectWalletButton>
        </div>
      </Wrapper>
    </Container>
  );
};

export default ConnectWallet;
