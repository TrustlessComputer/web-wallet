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
import React, { useContext } from 'react';
import { AssetsContext } from '@/contexts/assets-context';
import { CDN_URL } from '@/configs';
import { WalletContext } from '@/contexts/wallet-context';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/constants/route-path';
import format from '@/utils/amount';
import Token from '@/constants/token';
import { useCurrentUser } from '@/state/user/hooks';
import { TransactorContext } from '@/contexts/transactor-context';
import { ExportKeyModal } from '@/components/ExportKey';
import { generateBitcoinTaprootKey } from '@/utils/derive-key';
import * as TC_SDK from 'trustless-computer-sdk';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

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
  const [privateKey, setPrivateKey] = React.useState<string | null>(null);

  if (!user) return null;

  const profileWallet = account || '';

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

  const onClickExport = async () => {
    const { taprootChild } = await generateBitcoinTaprootKey(user.walletAddress || '');
    const privateKeyBuffer = taprootChild.privateKey;
    if (privateKeyBuffer) {
      setPrivateKey(TC_SDK.convertPrivateKey(privateKeyBuffer));
    }
  };

  const onClickShowSendBTC = () => onShowSendBTCModal();

  return (
    <>
      <StyledUserInfo className={className}>
        <div className="info">
          <div className="avatar">
            <div className="desktop">
              <Jazzicon diameter={200} seed={jsNumberForAddress(profileWallet)} />
            </div>
          </div>
          <div className="address">
            <div className="btc-address">
              <IconSVG src={IcPenguin} maxWidth="32" className="ic-token" />
              <div>
                <Text size="medium" color="text1">
                  TC address:
                </Text>
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
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="tooltip" style={{ minWidth: 300 }}>
                    <p>
                      This wallet is for Bitcoin network only. <strong style={{ fontWeight: 700 }}>DON’T</strong> send
                      any other assets besides BTC to it.
                    </p>
                  </Tooltip>
                }
              >
                <div className="btc-address">
                  <IconSVG src={IcBitcoin} maxWidth="32" className="ic-token" />
                  <div>
                    <Text size="medium" color="text1">
                      Bitcoin address:
                    </Text>
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
              </OverlayTrigger>
            )}
          </div>
          <div className="divider mb-24" />
          <div className="send-btn" onClick={onClickShowSendBTC}>
            <img src={`${CDN_URL}/icons/swap.svg`} alt="log out icon" />
            <Text size="medium" color="white" className="font-ibm">
              Send BTC
            </Text>
          </div>
          <div className="share-btn" onClick={onClickExport}>
            <img src={`${CDN_URL}/icons/ic-share.svg`} alt="log out icon" />
            <Text size="medium" color="white" className="font-ibm">
              Export Key
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
      <ExportKeyModal privateKey={privateKey} onHide={() => setPrivateKey(null)} />
    </>
  );
};

export default UserInfo;
