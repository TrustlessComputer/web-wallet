import IcMenuClose from '@/assets/icons/ic_close_menu.svg';
import Button2 from '@/components/Button2';
import { AssetsContext } from '@/contexts/assets-context';
import { ConnectContext } from '@/contexts/connect-context';
import { formatBTCPrice, formatEthPrice } from '@/utils/format';
import React, { ForwardedRef, useContext, useState } from 'react';
import { ConnectWalletButton, WalletBalance } from '../Header.styled';
import { Wrapper } from './MenuMobile.styled';

interface IProp {
  onCloseMenu: () => void;
}

const MenuMobile = React.forwardRef(({ onCloseMenu }: IProp, ref: ForwardedRef<HTMLDivElement>) => {
  const { btcBalance, bvmBalance } = useContext(AssetsContext);

  const { onConnect } = useContext(ConnectContext);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      await onConnect();
    } catch (err) {
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Wrapper ref={ref}>
      <div className="inner">
        <button className="btnMenuMobile" onClick={onCloseMenu}>
          <img src={IcMenuClose} alt="" />
        </button>
        <Button2 sizes="small" variants="ghost">
          <a href="https://tcgasstation.com/" target="_blank">
            Get TC
          </a>
        </Button2>
        <Button2 sizes="small" variants="ghost">
          <a href="https://trustless.computer/" target="_blank">
            Explore Dapp Store
          </a>
        </Button2>
        {btcBalance ? (
          <div className="wallet mobile">
            <WalletBalance>
              <div className="balance">
                <p>{formatBTCPrice(btcBalance)} BTC</p>
                <span className="divider" />
                <p>{formatEthPrice(bvmBalance)} TC</p>
              </div>
              {/* <div className="avatar">
                <img src={IcAvatarDefault} alt="default avatar" />
              </div> */}
            </WalletBalance>
          </div>
        ) : (
          <ConnectWalletButton onClick={handleConnectWallet}>
            {isConnecting ? 'Connecting...' : 'Connect wallet'}
          </ConnectWalletButton>
        )}
      </div>
    </Wrapper>
  );
});

MenuMobile.displayName = 'MenuMobile';
export default MenuMobile;
