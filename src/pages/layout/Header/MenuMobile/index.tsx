import IcAvatarDefault from '@/assets/icons/ic-avatar.svg';
import IcMenuClose from '@/assets/icons/ic_close_menu.svg';
import { AssetsContext } from '@/contexts/assets-context';
import { formatBTCPrice, formatEthPrice } from '@/utils/format';
import React, { ForwardedRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConnectWalletButton, WalletBalance } from '../Header.styled';
import { Wrapper } from './MenuMobile.styled';
import { useSelector } from 'react-redux';
import { getIsAuthenticatedSelector } from '@/state/user/selector';
import { ROUTE_PATH } from '@/constants/route-path';

interface IProp {
  onCloseMenu: () => void;
}

const MenuMobile = React.forwardRef(({ onCloseMenu }: IProp, ref: ForwardedRef<HTMLDivElement>) => {
  const { btcBalance, juiceBalance } = useContext(AssetsContext);
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const navigate = useNavigate();

  const handleConnectWallet = async () => {
    navigate(`${ROUTE_PATH.CONNECT_WALLET}?next=${window.location.href}`);
  };

  return (
    <Wrapper ref={ref}>
      <div className="inner">
        <button className="btnMenuMobile" onClick={onCloseMenu}>
          <img src={IcMenuClose} alt="" />
        </button>
        {isAuthenticated ? (
          <div className="wallet mobile">
            <WalletBalance>
              <div className="balance">
                <p>{formatBTCPrice(btcBalance)} BTC</p>
                <span className="divider" />
                <p>{formatEthPrice(juiceBalance)} TC</p>
              </div>
              <div className="avatar">
                <img src={IcAvatarDefault} alt="default avatar" />
              </div>
            </WalletBalance>
          </div>
        ) : (
          <ConnectWalletButton onClick={handleConnectWallet}>Connect Wallet</ConnectWalletButton>
        )}
      </div>
    </Wrapper>
  );
});

MenuMobile.displayName = 'MenuMobile';
export default MenuMobile;
