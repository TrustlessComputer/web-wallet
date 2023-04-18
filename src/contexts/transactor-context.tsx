import React, { PropsWithChildren, useMemo } from 'react';
import ModalSignTx from '@/components/SignTransaction/Modal';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as TC_SDK from 'trustless-computer-sdk';
import { useCurrentUser } from '@/state/user/hooks';
import { ROUTE_PATH } from '@/constants/route-path';

export interface ITransactorContext {
  signData?: TC_SDK.CallWalletPayload;
  onCancelSign: () => void;
}

const initialValue: ITransactorContext = {
  signData: undefined,
  onCancelSign: () => null,
};

export const TransactorContext = React.createContext<ITransactorContext>(initialValue);

export const TransactorProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const [searchParams] = useSearchParams();
  const user = useCurrentUser();
  const [signData, setSignData] = React.useState<TC_SDK.CallWalletPayload | undefined>(undefined);
  const navigate = useNavigate();

  const isShowSign = React.useMemo(() => {
    return !!signData && !!user;
  }, [signData, user]);

  const getSignSearchParams = () => {
    const hash = searchParams.get('hash');
    const method = searchParams.get('method');
    const dappURL = searchParams.get('dappURL');
    const isRedirect = searchParams.get('isRedirect');
    if (hash && method && dappURL) {
      setSignData({
        hash,
        method,
        dappURL,
        isRedirect: Boolean(isRedirect),
      });
    }
  };

  const onCancelSign = () => {
    setSignData(undefined);
    navigate(ROUTE_PATH.WALLET, { replace: true });
  };

  React.useEffect(getSignSearchParams, []);

  const contextValues = useMemo((): ITransactorContext => {
    return { signData, onCancelSign };
  }, [signData]);

  return (
    <TransactorContext.Provider value={contextValues}>
      {children}
      <ModalSignTx show={isShowSign} onHide={onCancelSign} signData={signData} />
    </TransactorContext.Provider>
  );
};
