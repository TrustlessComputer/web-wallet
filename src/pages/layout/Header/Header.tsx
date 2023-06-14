import Button2 from '@/components/Button2';
import IcOpenMenu from '@/assets/icons/ic_hambuger.svg';
import { CDN_URL } from '@/configs';
import { ROUTE_PATH } from '@/constants/route-path';
import { gsap, Power3 } from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AssetDropdown from './AssetDropdown';
import { Wrapper } from './Header.styled';
import MenuMobile from './MenuMobile';

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
      <div className="rowLink">
        <Link className="logo" to={ROUTE_PATH.HOME}>
          <img alt="logo" src={`${CDN_URL}/icons/wallet_logo.svg`} width={48} height={48} />
        </Link>
        <div className="assets">
          <AssetDropdown />
        </div>
      </div>

      <div className="rightContainer">
        <div className="buttons">
          <Button2 sizes="small" variants="ghost" isArrowRight={true}>
            <a href="https://tcgasstation.com/" target="_blank">
              Get TC
            </a>
          </Button2>
          <Button2 sizes="small" variants="ghost" isArrowRight={true}>
            <a href="https://trustless.computer/" target="_blank">
              Explore Dapp Store
            </a>
          </Button2>
        </div>

        <MenuMobile ref={refMenu} onCloseMenu={() => setIsOpenMenu(false)} />
        <button className="btnMenuMobile" onClick={() => setIsOpenMenu(true)}>
          <img src={IcOpenMenu} alt="menu" />
        </button>
      </div>
    </Wrapper>
  );
};

export default Header;
