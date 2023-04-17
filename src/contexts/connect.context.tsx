import React, { PropsWithChildren, useContext, useMemo } from 'react';
import { WalletContext } from '@/contexts/wallet-context';
import { toast } from 'react-hot-toast';
import { useAppDispatch } from '@/state/hooks';
import { resetUser, updateUser } from '@/state/user/reducer';
import WError, { ERROR_CODE } from '@/utils/error';
import { useWeb3React } from '@web3-react/core';
import { Methods } from '@/constants/method';

export interface IConnectContext {
  onConnect: () => Promise<unknown>;
}

const initialValue: IConnectContext = {
  onConnect: () => new Promise<null>(r => r(null)),
};

export const ConnectContext = React.createContext<IConnectContext>(initialValue);

export const ConnectProvider: React.FC<PropsWithChildren> = ({ children }: PropsWithChildren): React.ReactElement => {
  const { provider } = useWeb3React();
  const {
    onConnect: connectMetamask,
    onDeriveBitcoinKey,
    onDisconnect: disconnectMetamask,
  } = useContext(WalletContext);
  const dispatch = useAppDispatch();

  const onConnectMetamask = async () => {
    try {
      console.log('SANG TEST: 111');
      const tcAddress = await connectMetamask();
      console.log('SANG TEST: 222');
      if (tcAddress) {
        const tpAddress = await onDeriveBitcoinKey(tcAddress || '');
        console.log('SANG TEST: 333');
        dispatch(
          updateUser({
            tpAddress,
            tcAddress,
          }),
        );
      }
    } catch (e) {
      console.log('SANG TEST: 444');
      console.error('Connect metamask error: ', e);
      toast.error('Can not connect metamask.');
      await disconnectMetamask();
      throw new WError(ERROR_CODE.CONNECT_WALLET);
    }
  };

  const connect = async () => {
    await onConnectMetamask();
  };

  const handleAccountChange = () => {
    dispatch(resetUser());
    window.location.reload();
  };

  const handleDisconnected = () => {
    dispatch(resetUser());
    window.location.reload();
  };

  React.useEffect(() => {
    provider?.on(Methods.ACCOUNT_CHANGED, handleAccountChange);
    provider?.on(Methods.DISCONNECT, handleDisconnected);
  }, [provider]);

  const contextValues = useMemo((): IConnectContext => {
    return {
      onConnect: connect,
    };
  }, [connect]);

  return <ConnectContext.Provider value={contextValues}>{children}</ConnectContext.Provider>;
};
