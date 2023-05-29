import IcOpenMenu from '@/assets/icons/ic_hambuger.svg';
import { CDN_URL } from '@/configs';
import { ROUTE_PATH } from '@/constants/route-path';
import { gsap, Power3 } from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrapper } from './Header.styled';
import MenuMobile from './MenuMobile';
// import WalletHeader from './Wallet';

const Header = ({ height }: { height: number }) => {
  const refMenu = useRef<HTMLDivElement | null>(null);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);

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
        <img alt="logo" src={`${CDN_URL}/icons/wallet_logo.svg`} width={50} height={50} />
      </Link>
      <div className="rowLink" />
      <MenuMobile ref={refMenu} onCloseMenu={() => setIsOpenMenu(false)} />
      <div className="rightContainer">
        {/* <WalletHeader /> */}
        <div className="external-link">
          <a href={'https://trustless.computer/'} target="_blank">
            Trustless
          </a>
          <a href={'https://tcgasstation.com/'} target="_blank">
            Get TC
          </a>
        </div>
        <button className="btnMenuMobile" onClick={() => setIsOpenMenu(true)}>
          <img src={IcOpenMenu} alt="" />
        </button>
      </div>
    </Wrapper>
  );
};

export default Header;
