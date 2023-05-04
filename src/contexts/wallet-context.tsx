import React, { PropsWithChildren, useEffect, useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch } from '@/state/hooks';
import { resetUser, updateSelectedWallet } from '@/state/user/reducer';
import { getConnection } from '@/connection';
import { generateBitcoinTaprootKey } from '@/utils/derive-key';
import { switchChain } from '@/utils';
import { SupportedChainId } from '@/constants/chains';
import { useCurrentUser } from '@/state/user/hooks';
import { triggerSwitchAccount } from '@/services/tcNode';
import { getLastedWalletAddress, setLastedWalletAddress } from '@/utils/auth-storage';

export interface IWalletContext {
  onDisconnect: () => Promise<void>;
  onConnect: () => Promise<string | null>;
  onRequestAccounts: () => Promise<string[] | null>;
  onDeriveBitcoinKey: (walletAddress: string) => Promise<string | null>;
}

const initialValue: IWalletContext = {
  onDisconnect: () => new Promise<void>(r => r()),
  onConnect: () => new Promise<null>(r => r(null)),
  onRequestAccounts: () => new Promise<null>(r => r(null)),
  onDeriveBitcoinKey: () => new Promise<null>(r => r(null)),
};

export const WalletContext = React.createContext<IWalletContext>(initialValue);

export const WalletProvider: React.FC<PropsWithChildren> = ({ children }: PropsWithChildren): React.ReactElement => {
  const { connector, provider, account, chainId } = useWeb3React();
  const dispatch = useAppDispatch();
  const user = useCurrentUser();

  const requestAccounts = React.useCallback(async (): Promise<string[] | null> => {
    const accounts = await connector.provider?.request({
      method: 'eth_accounts',
    });

    if (accounts && Array.isArray(accounts)) {
      triggerChangeAccount(accounts[0]);
    }
    return accounts as string[] | null;
  }, [connector]);

  const disconnect = React.useCallback(async () => {
    console.info('disconnecting...');
    if (connector && connector.deactivate) {
      await connector.deactivate();
    }
    await connector.resetState();
    dispatch(resetUser());
  }, [connector, dispatch, user]);

  const connect = React.useCallback(async () => {
    const connection = getConnection(connector);
    if (!connection) {
      throw new Error('Get connection error.');
    }
    await connection.connector.activate();
    const accounts = await requestAccounts();
    if (accounts && Array.isArray(accounts)) {
      if (chainId !== SupportedChainId.TRUSTLESS_COMPUTER) {
        await switchChain(SupportedChainId.TRUSTLESS_COMPUTER);
      }
      dispatch(updateSelectedWallet({ wallet: connection.type }));
      return accounts[0];
    }
    return null;
  }, [dispatch, connector, provider]);

  const onDeriveBitcoinKey = React.useCallback(
    async (evmWalletAddress: string) => {
      if (evmWalletAddress) {
        const { address: taprootAddress } = await generateBitcoinTaprootKey(evmWalletAddress);
        if (taprootAddress) {
          return taprootAddress;
        }
      }
      return null;
    },
    [dispatch, account],
  );

  const triggerChangeAccount = (address: string) => {
    const lastedWalletAddress = getLastedWalletAddress();
    if (lastedWalletAddress === null || lastedWalletAddress.toLocaleLowerCase() !== address.toLocaleLowerCase()) {
      triggerSwitchAccount(address);
      setLastedWalletAddress(address);
    }
  };

  useEffect(() => {
    const handleAccountsChanged = async () => {
      await disconnect();
    };

    if (window.ethereum) {
      Object(window.ethereum).on('accountsChanged', handleAccountsChanged);
    }
  }, [disconnect]);

  const contextValues = useMemo((): IWalletContext => {
    return {
      onDisconnect: disconnect,
      onConnect: connect,
      onDeriveBitcoinKey,
      onRequestAccounts: requestAccounts,
    };
  }, [disconnect, connect, onDeriveBitcoinKey]);

  return <WalletContext.Provider value={contextValues}>{children}</WalletContext.Provider>;
};
