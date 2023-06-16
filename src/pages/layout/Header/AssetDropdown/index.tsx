import IconSVG from '@/components/IconSVG';
import Dropdown, { IDropdownRef } from '@/components/Popover';
import Text from '@/components/Text';
import { CDN_URL_ICONS, CDN_URL } from '@/configs';
import Token from '@/constants/token';
import { AssetsContext } from '@/contexts/assets-context';
import { TransactorContext } from '@/contexts/transactor-context';
import { useCurrentUser } from '@/state/user/hooks';
import { ellipsisCenter } from '@/utils';
import format from '@/utils/amount';
import copy from 'copy-to-clipboard';
import React, { useContext } from 'react';
import toast from 'react-hot-toast';
import { DropdownItem, DropdownList, Element, MoreDropdownItem, MoreDropdownList } from './styled';
import ToolTip from '@/components/Tooltip';
import { generateBitcoinTaprootKey } from '@/utils/derive-key';
import * as TC_SDK from 'trustless-computer-sdk';
import { ExportKeyModal } from '@/components/ExportKey';
import { WalletContext } from '@/contexts/wallet-context';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/constants/route-path';

const AssetDropdown = React.memo(() => {
  const user = useCurrentUser();
  const { onShowSendBTCModal } = useContext(TransactorContext);
  const navigate = useNavigate();

  const dropdownRef = React.useRef<IDropdownRef>({
    onToggle: () => undefined,
  });
  const [privateKey, setPrivateKey] = React.useState<string | null>(null);

  const { btcBalance, bvmBalance: tcBalance } = useContext(AssetsContext);
  const { onDisconnect } = useContext(WalletContext);

  const formatTcBalance = format.shorterAmount({ originalAmount: tcBalance, decimals: Token.TRUSTLESS.decimal });
  const formatBtcBalance = format.shorterAmount({ originalAmount: btcBalance, decimals: Token.BITCOIN.decimal });

  const onClickExportBtcKey = async () => {
    const { taprootChild } = await generateBitcoinTaprootKey(user?.walletAddress || '');
    const privateKeyBuffer = taprootChild.privateKey;
    if (privateKeyBuffer) {
      setPrivateKey(TC_SDK.convertPrivateKey(privateKeyBuffer));
    }
  };

  const onClickDisconnect = () => {
    onDisconnect().then(() => {
      navigate(ROUTE_PATH.WALLET);
    });
  };

  const onCopy = (address: string) => {
    copy(address);
    toast.success('Copied');
  };

  const assets = [
    {
      src: `${CDN_URL_ICONS}/ic-penguin-dark.svg`,
      address: user ? user.walletAddress : '',
      symbol: Token.TRUSTLESS.symbol,
      formatAddress: `Trustless (
        ${ellipsisCenter({
          str: user ? user.walletAddress : '',
          limit: 4,
        })}
        )`,
      formatBalance: `${formatTcBalance} TC`,
      actions: [
        {
          className: 'action',
          icon: <IconSVG src={`${CDN_URL_ICONS}/ic-copy-asset-dark.svg`} maxWidth="18" />,
          onClick: () => onCopy(user?.walletAddress || ''),
          tooltip: 'Copy TC address',
        },
      ],
      moreItems: [],
    },
    {
      src: `${CDN_URL_ICONS}/ic-bitcoin.svg`,
      address: user ? user.walletAddressBtcTaproot : '',
      symbol: Token.BITCOIN.symbol,
      formatAddress: `Bitcoin (
        ${ellipsisCenter({
          str: user ? user.walletAddressBtcTaproot : '',
          limit: 4,
        })}
        )`,
      formatBalance: `${formatBtcBalance} BTC`,
      actions: [
        {
          className: 'action',
          icon: <IconSVG src={`${CDN_URL_ICONS}/ic-copy-asset-dark.svg`} maxWidth="18" />,
          onClick: () => onCopy(user?.walletAddressBtcTaproot || ''),
          tooltip: <p>This wallet is for Bitcoin network only. DON’T send any other assets besides BTC to it.</p>,
        },
        {
          className: 'action',
          icon: <IconSVG src={`${CDN_URL}/icons/swap.svg`} maxWidth="18" />,
          onClick: () => onShowSendBTCModal(),
          tooltip: 'Send BTC',
        },
        {
          className: 'action',
          icon: <IconSVG src={`${CDN_URL_ICONS}/ic-exportkey-dark.svg`} maxWidth="18" />,
          onClick: () => onClickExportBtcKey(),
          tooltip: 'Export BTC Key',
        },
      ],
      moreItems: [],
    },
  ];

  const renderAction = (
    iconName: string,
    title: string,
    onClick: () => void,
    showBorder: boolean = true,
    textClassName?: string,
  ) => {
    return (
      <div className={`actions ${showBorder ? 'actions-border-top' : ''}`}>
        <div className="create-btn" onClick={onClick}>
          <IconSVG src={`${CDN_URL_ICONS}/${iconName}`} maxWidth="20" />
          <Text color="text-primary" fontWeight="medium" size="regular" className={textClassName || 'text'}>
            {title}
          </Text>
        </div>
      </div>
    );
  };

  if (!user) {
    return <></>;
  }

  return (
    <>
      <Dropdown
        element={
          <Element>
            <p>{formatTcBalance} TC</p>
            <div className="ele-indicator" />
            <p>{formatBtcBalance} BTC</p>
          </Element>
        }
        width={384}
        type="hover"
        ref={dropdownRef}
      >
        {user && (
          <DropdownList>
            {assets.map((asset, index) => {
              return (
                <DropdownItem key={index.toString()}>
                  <div className="item">
                    <IconSVG src={asset.src} maxWidth="32" />
                    <div>
                      <Text color="text-secondary" fontWeight="light" size="regular">
                        {asset.formatAddress}
                      </Text>
                      <Text color="text-highlight" fontWeight="medium" size="medium">
                        {asset.formatBalance}
                      </Text>
                    </div>
                  </div>
                  <div className="item-actions">
                    {asset.actions.map(action => {
                      return (
                        <ToolTip
                          unwrapElement={
                            <div className="action" onClick={action.onClick}>
                              {action.icon}
                            </div>
                          }
                          width={300}
                        >
                          <Text size="small">{action.tooltip}</Text>
                        </ToolTip>
                      );
                    })}
                    {asset.moreItems.length > 0 && (
                      <Dropdown
                        unwrapElement={
                          <ToolTip
                            unwrapElement={
                              <div className="action">
                                <IconSVG src={`${CDN_URL_ICONS}/ic-more-vertical.svg`} maxWidth="18" />
                              </div>
                            }
                            width={300}
                          >
                            <Text size="small">More</Text>
                          </ToolTip>
                        }
                        width={300}
                      >
                        <MoreDropdownList>
                          {asset.moreItems.map((item: any) => {
                            return (
                              <MoreDropdownItem
                                key={item.title}
                                onClick={() => {
                                  item.onClick();
                                  dropdownRef.current.onToggle();
                                }}
                              >
                                <div className={item.iconClass}>{item.icon}</div>
                                <Text className={item.titleClass} size="small">
                                  {item.title}
                                </Text>
                              </MoreDropdownItem>
                            );
                          })}
                        </MoreDropdownList>
                      </Dropdown>
                    )}
                  </div>
                </DropdownItem>
              );
            })}
            {renderAction('ic-logout-dark.svg', 'Disconnect', () => onClickDisconnect(), true, 'text-remove')}
          </DropdownList>
        )}
      </Dropdown>
      <ExportKeyModal privateKey={privateKey} onHide={() => setPrivateKey(null)} />
    </>
  );
});

export default AssetDropdown;
