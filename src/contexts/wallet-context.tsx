import React, { PropsWithChildren, useEffect, useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch } from '@/state/hooks';
import { resetUser, updateEVMWallet, updateSelectedWallet, updateTaprootWallet } from '@/state/user/reducer';
import { getConnection } from '@/connection';
import { generateBitcoinTaprootKey } from '@/utils/derive-key';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@/state/user/selector';
import bitcoinStorage from '@/utils/bitcoin-storage';
import { clearAuthStorage } from '@/utils/auth-storage';
import { switchChain } from '@/utils';
import { SupportedChainId } from '@/constants/chains';

export interface IWalletContext {
  onDisconnect: () => Promise<void>;
  onConnect: () => Promise<string | null>;
  onDeriveBitcoinKey: (walletAddress: string) => Promise<string | null>;
}

const initialValue: IWalletContext = {
  onDisconnect: () => new Promise<void>(r => r()),
  onConnect: () => new Promise<null>(r => r(null)),
  onDeriveBitcoinKey: () => new Promise<null>(r => r(null)),
};

export const WalletContext = React.createContext<IWalletContext>(initialValue);

export const WalletProvider: React.FC<PropsWithChildren> = ({ children }: PropsWithChildren): React.ReactElement => {
  const { connector, provider, account, chainId } = useWeb3React();
  const dispatch = useAppDispatch();
  const user = useSelector(getUserSelector);

  const disconnect = React.useCallback(async () => {
    console.log('disconnecting...');
    console.log('user', user);
    if (user?.walletAddress) {
      bitcoinStorage.removeUserTaprootAddress(user?.walletAddress);
    }
    if (connector && connector.deactivate) {
      await connector.deactivate();
    }
    await connector.resetState();
    clearAuthStorage();
    dispatch(resetUser());
    // TODO Clear localstorage
    localStorage.clear();
  }, [connector, dispatch, user]);

  const connect = React.useCallback(async () => {
    const connection = getConnection(connector);
    if (!connection) {
      throw new Error('Get connection error.');
    }
    await connection.connector.activate();
    if (chainId !== SupportedChainId.TRUSTLESS_COMPUTER) {
      await switchChain(SupportedChainId.TRUSTLESS_COMPUTER);
    }
    if (account) {
      const tcAddress = account;
      dispatch(updateEVMWallet(tcAddress));
      dispatch(updateSelectedWallet({ wallet: connection.type }));
      return tcAddress;
    }
    return null;
  }, [dispatch, connector, provider]);

  const onDeriveBitcoinKey = React.useCallback(
    async (evmWalletAddress: string) => {
      if (evmWalletAddress) {
        const existedWallet = bitcoinStorage.getUserTaprootAddress(evmWalletAddress);
        if (existedWallet) {
          dispatch(updateTaprootWallet(existedWallet));
          return existedWallet;
        }
        const { address: taprootAddress } = await generateBitcoinTaprootKey(evmWalletAddress);
        if (taprootAddress) {
          dispatch(updateTaprootWallet(taprootAddress));
          return taprootAddress;
        }
      }
      return null;
    },
    [dispatch, account],
  );

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
    };
  }, [disconnect, connect, onDeriveBitcoinKey]);

  return <WalletContext.Provider value={contextValues}>{children}</WalletContext.Provider>;
};
