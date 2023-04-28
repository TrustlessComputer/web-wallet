import React, { PropsWithChildren, useMemo } from 'react';
import ModalSignTx from '@/components/SignTransaction/Modal';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as TC_SDK from 'trustless-computer-sdk';
import { useCurrentUser } from '@/state/user/hooks';
import { ROUTE_PATH } from '@/constants/route-path';
import ModalConfirmRequestDapp from '@/components/RequestDapp/Modal';
import { SendBTCModal } from '@/components/SendBTC';

export interface ITransactorContext {
  signData?: TC_SDK.CallWalletPayload;
  requestData?: TC_SDK.RequestPayload;
  onCancelSign: () => void;
  onShowSendBTCModal: () => void;
}

const initialValue: ITransactorContext = {
  signData: undefined,
  requestData: undefined,
  onCancelSign: () => null,
  onShowSendBTCModal: () => null,
};

export const TransactorContext = React.createContext<ITransactorContext>(initialValue);

export const TransactorProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const [searchParams] = useSearchParams();
  const user = useCurrentUser();
  const [signData, setSignData] = React.useState<TC_SDK.CallWalletPayload | undefined>(undefined);
  const [requestData, setRequestData] = React.useState<TC_SDK.RequestPayload | undefined>(undefined);
  const [showSendBTCModal, setShowSendBTCModal] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const isShowSign = React.useMemo(() => {
    return !!signData && !!user;
  }, [signData, user]);

  const isShowRequest = React.useMemo(() => {
    return !!requestData && !!user;
  }, [requestData, user]);

  const getSignSearchParams = () => {
    const actionName = searchParams.get('function');
    if (!actionName) return;
    if (actionName === TC_SDK.RequestFunction.sign) {
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
    } else if (actionName === TC_SDK.RequestFunction.request) {
      const redirectURL = searchParams.get('redirectURL');
      const method = searchParams.get('method');
      const target = searchParams.get('target');
      if (redirectURL && redirectURL) {
        setRequestData({
          method: method as TC_SDK.RequestMethod,
          redirectURL: redirectURL,
          target: target as TC_SDK.Target,
        });
      }
    }
  };

  const onCancelSign = () => {
    setSignData(undefined);
    navigate(ROUTE_PATH.WALLET, { replace: true });
  };

  const onCancelRequest = () => {
    setRequestData(undefined);
    navigate(ROUTE_PATH.WALLET, { replace: true });
  };

  const onShowSendBTCModal = () => {
    setShowSendBTCModal(true);
  };

  React.useEffect(getSignSearchParams, []);

  const contextValues = useMemo((): ITransactorContext => {
    return { signData, onCancelSign, requestData, onShowSendBTCModal };
  }, [signData, requestData, onShowSendBTCModal]);

  return (
    <TransactorContext.Provider value={contextValues}>
      {children}
      <ModalSignTx show={isShowSign} onHide={onCancelSign} signData={signData} />
      <ModalConfirmRequestDapp show={isShowRequest} onHide={onCancelRequest} requestData={requestData} />
      <SendBTCModal
        show={showSendBTCModal}
        onHide={() => {
          setShowSendBTCModal(false);
        }}
      />
    </TransactorContext.Provider>
  );
};
