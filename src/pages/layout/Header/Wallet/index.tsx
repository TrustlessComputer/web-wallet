import IconSVG from '@/components/IconSVG';
import Text from '@/components/Text';
import { CDN_URL, TC_URL } from '@/configs';
import { ROUTE_PATH } from '@/constants/route-path';
import Token from '@/constants/token';
// import { ROUTE_PATH } from '@/constants/route-path';
import { AssetsContext } from '@/contexts/assets-context';
import { WalletContext } from '@/contexts/wallet-context';
import { DappsTabs } from '@/enums/tabs';
import { useCurrentUser } from '@/state/user/hooks';
import { formatLongAddress } from '@/utils';
import format from '@/utils/amount';
import copy from 'copy-to-clipboard';
// import { useRouter } from 'next/router';
import { useContext, useRef, useState } from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { useNavigate } from 'react-router-dom';
import { WalletBalance } from '../Header.styled';
import { WalletPopover } from './Wallet.styled';

const WalletHeader = () => {
  const user = useCurrentUser();
  const navigate = useNavigate();

  const { onDisconnect } = useContext(WalletContext);

  const { btcBalance, bvmBalance } = useContext(AssetsContext);

  const [show, setShow] = useState(false);
  const handleOnMouseEnter = () => {
    setShow(true);
  };
  const handleOnMouseLeave = () => {
    console.log('trigger');

    setShow(false);
  };
  const ref = useRef(null);

  const onClickCopy = (address: string) => {
    copy(address);
    toast.success('Copied');
  };

  const walletPopover = (
    <WalletPopover id="wallet-header" onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave} show={show}>
      <div className="wallet-tc">
        <div className="wallet-item">
          <IconSVG src={`${CDN_URL}/icons/ic-penguin-artifact.svg`} maxWidth="24" maxHeight="24" />
          <Text size={'regular'} className="wallet-address" fontWeight="regular">
            {formatLongAddress(user?.walletAddress || '')}
          </Text>
        </div>
        <div className="icCopy" onClick={() => onClickCopy(user?.walletAddress || '')}>
          <IconSVG
            src={`${CDN_URL}/icons/ic-copy-artifact.svg`}
            color="white"
            maxWidth="16"
            // type="stroke"
          ></IconSVG>
        </div>
      </div>
      <div className="divider"></div>
      <div className="wallet-btc">
        <div className="wallet-item">
          <IconSVG src={`${CDN_URL}/icons/ic-btc.svg`} maxWidth="24" maxHeight="24" />
          <Text size={'regular'} className="wallet-address" fontWeight="regular">
            {formatLongAddress(user?.walletAddressBtcTaproot || '')}
          </Text>
        </div>
        <div className="icCopy" onClick={() => onClickCopy(user?.walletAddressBtcTaproot || '')}>
          <IconSVG src={`${CDN_URL}/icons/ic-copy-artifact.svg`} color="white" maxWidth="16"></IconSVG>
        </div>
      </div>
      <div className="divider"></div>
      <div className="cta">
        <div className="wallet-link" onClick={() => window.open(`${TC_URL}?tab=${DappsTabs.ARTIFACT}`)}>
          <IconSVG src={`${CDN_URL}/icons/ic-wallet-artifact.svg`} maxWidth="20" />
          <Text size="medium">Wallet</Text>
        </div>
        <div className="wallet-disconnect" onClick={onDisconnect}>
          <IconSVG src={`${CDN_URL}/icons/ic-logout-artifact.svg`} maxWidth="20" />
          <Text size="medium">Disconnect</Text>
        </div>
      </div>
    </WalletPopover>
  );

  return (
    <>
      {user && (
        <OverlayTrigger
          trigger={['hover', 'focus']}
          placement="bottom"
          overlay={walletPopover}
          container={ref}
          show={show}
        >
          <div
            className="wallet"
            onClick={() => navigate(ROUTE_PATH.HOME)}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          >
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
                <Jazzicon diameter={32} seed={jsNumberForAddress(user.walletAddress)} />
              </div>
            </WalletBalance>
          </div>
        </OverlayTrigger>
      )}
    </>
  );
};

export default WalletHeader;
