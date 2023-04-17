import IcOpenMenu from '@/assets/icons/ic_hambuger.svg';
import IcLogo from '@/assets/icons/logo.svg';
import { AssetsContext } from '@/contexts/assets-context';
import { useWeb3React } from '@web3-react/core';
import { gsap, Power3 } from 'gsap';
import { useContext, useEffect, useRef, useState } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { Link, useNavigate } from 'react-router-dom';
import { ConnectWalletButton, WalletBalance, Wrapper } from './Header.styled';
import MenuMobile from './MenuMobile';
import { useSelector } from 'react-redux';
import { getIsAuthenticatedSelector } from '@/state/user/selector';
import { ROUTE_PATH } from '@/constants/route-path';
import format from '@/utils/amount';
import Token from '@/constants/token';

const Header = ({ height }: { height: number }) => {
  const { account } = useWeb3React();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const { btcBalance, bvmBalance } = useContext(AssetsContext);
  const refMenu = useRef<HTMLDivElement | null>(null);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);

  const goToConnectWalletPage = async () => {
    navigate(`${ROUTE_PATH.CONNECT_WALLET}?next=${window.location.href}`);
  };

  useEffect(() => {
    if (refMenu.current) {
      if (isOpenMenu) {
        gsap.to(refMenu.current, { x: 0, duration: 0.6, ease: Power3.easeInOut });
      } else {
        gsap.to(refMenu.current, {
          x: '100%',
          duration: 0.6,
          ease: Power3.easeInOut,
        });
      }
    }
  }, [isOpenMenu]);

  return (
    <Wrapper style={{ height }}>
      <div className="indicator" />
      <Link className="logo" to={ROUTE_PATH.HOME}>
        <img alt="logo" src={IcLogo} />
      </Link>
      <div className="rowLink" />
      <MenuMobile ref={refMenu} onCloseMenu={() => setIsOpenMenu(false)} />
      <div className="rightContainer">
        {account && isAuthenticated ? (
          <>
            <div className="wallet" onClick={() => navigate(ROUTE_PATH.HOME)}>
              <WalletBalance>
                <div className="balance">
                  <p>
                    {format.shorterAmount({
                      originalAmount: btcBalance,
                      decimals: Token.BITCOIN.decimal,
                    })}{' '}
                    {Token.BITCOIN.symbol}
                  </p>
                  <span className="divider" />
                  <p>
                    {format.shorterAmount({
                      originalAmount: bvmBalance,
                      decimals: Token.TRUSTLESS.decimal,
                    })}{' '}
                    {Token.TRUSTLESS.symbol}
                  </p>
                </div>
                <div className="avatar">
                  <Jazzicon diameter={32} seed={jsNumberForAddress(account)} />
                </div>
              </WalletBalance>
            </div>
          </>
        ) : (
          <ConnectWalletButton onClick={goToConnectWalletPage}>Connect wallet</ConnectWalletButton>
        )}
        <button className="btnMenuMobile" onClick={() => setIsOpenMenu(true)}>
          <img src={IcOpenMenu} alt="" />
        </button>
      </div>
    </Wrapper>
  );
};

export default Header;
