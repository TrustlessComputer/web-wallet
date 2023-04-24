import IcCopy from '@/assets/icons/ic-copy-outline.svg';
import IcPenguin from '@/assets/icons/ic-penguin.svg';
import IcBitcoin from '@/assets/icons/ic-btc.svg';
import { formatLongAddress, shortenAddress } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import copy from 'copy-to-clipboard';
import { toast } from 'react-hot-toast';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { StyledUserInfo } from './UserInfo.styled';
import Text from '@/components/Text';
import IconSVG from '@/components/IconSVG';
import { useContext } from 'react';
import { AssetsContext } from '@/contexts/assets-context';
import { CDN_URL } from '@/configs';
import { WalletContext } from '@/contexts/wallet-context';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/constants/route-path';
import format from '@/utils/amount';
import Token from '@/constants/token';
import { useCurrentUser } from '@/state/user/hooks';
import { TransactorContext } from '@/contexts/transactor-context';

type Props = {
  className?: string;
};

const UserInfo = ({ className }: Props) => {
  const user = useCurrentUser();
  const { account } = useWeb3React();
  const { btcBalance, bvmBalance } = useContext(AssetsContext);
  const { onDisconnect } = useContext(WalletContext);
  const { onShowSendBTCModal } = useContext(TransactorContext);
  const navigate = useNavigate();

  if (!user) return null;

  const profileWallet = account || '';

  // const profileWallet = user.walletAddress || '';
  const profileBtcWallet = user.walletAddressBtcTaproot || '';

  const onClickCopy = (text: string) => {
    copy(text);
    toast.success('Copied');
  };

  const onClickDisconnect = () => {
    onDisconnect().then(() => {
      navigate(ROUTE_PATH.WALLET);
    });
  };

  const onClickShowSendBTC = () => onShowSendBTCModal();

  return (
    <StyledUserInfo className={className}>
      <div className="info">
        <div className="avatar">
          <div className="desktop">
            <Jazzicon diameter={200} seed={jsNumberForAddress(profileWallet)} />
          </div>
        </div>
        <div className="address">
          <div className="btc-address">
            <IconSVG src={IcPenguin} maxWidth="32" />
            <div>
              <div className="wallet-address">
                <h5> {shortenAddress(profileWallet, 4)}</h5>
                <div className="icCopy" onClick={() => onClickCopy(profileWallet)}>
                  <img alt="ic-copy" src={IcCopy} />
                </div>
              </div>
              <Text size="medium" color="text2">
                {format.shorterAmount({
                  originalAmount: bvmBalance,
                  decimals: Token.TRUSTLESS.decimal,
                })}{' '}
                {Token.TRUSTLESS.symbol}
              </Text>
            </div>
          </div>
          {profileBtcWallet && (
            <div className="btc-address">
              <IconSVG src={IcBitcoin} maxWidth="32" />
              <div>
                <div className="wallet-address">
                  <h5> {formatLongAddress(profileBtcWallet)}</h5>
                  <div className="icCopy" onClick={() => onClickCopy(profileBtcWallet)}>
                    <img alt="ic-copy" src={IcCopy} />
                  </div>
                </div>
                <Text size="medium" color="text2">
                  {format.shorterAmount({
                    originalAmount: btcBalance,
                    decimals: Token.BITCOIN.decimal,
                  })}{' '}
                  {Token.BITCOIN.symbol}
                </Text>
              </div>
            </div>
          )}
        </div>
        <div className="divider mb-24" />
        <div className="disconnect-btn" onClick={onClickShowSendBTC}>
          <img src={`${CDN_URL}/icons/swap.svg`} alt="log out icon" />
          <Text size="medium" color="white" className="font-ibm">
            Send BTC
          </Text>
        </div>
        <div className="disconnect-btn" onClick={onClickDisconnect}>
          <img src={`${CDN_URL}/icons/ic-logout.svg`} alt="log out icon" />
          <Text size="medium" color="white" className="font-ibm">
            Disconnect
          </Text>
        </div>
      </div>
      <div className="options" />
    </StyledUserInfo>
  );
};

export default UserInfo;
