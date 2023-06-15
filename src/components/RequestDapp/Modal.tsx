import React from 'react';
import { StyledSignModal } from '@/components/SignTransaction/Modal.styled';
import Text from '@/components/Text';
import { Modal } from 'react-bootstrap';
import Button2 from '@/components/Button2';
import * as TC_SDK from 'trustless-computer-sdk';
import IconSVG from '@/components/IconSVG';
import IcCloseModal from '@/assets/icons/ic-close.svg';
import { useCurrentUser } from '@/state/user/hooks';

interface IProps {
  show: boolean;
  onHide: () => void;
  requestData?: TC_SDK.RequestPayload;
}

const ModalConfirmRequestDapp = React.memo(({ show, onHide, requestData }: IProps) => {
  const user = useCurrentUser();
  const onConnect = () => {
    if (!requestData || !user) return;
    TC_SDK.requestAccountResponse({
      redirectURL: requestData.redirectURL,
      tcAddress: user.walletAddress,
      tpAddress: user.walletAddressBtcTaproot,
    });
    onHide();
  };

  return (
    <StyledSignModal show={show} centered>
      <Modal.Header>
        <IconSVG className="cursor-pointer scale-up-anim" onClick={onHide} src={IcCloseModal} maxWidth={'22px'} />
      </Modal.Header>
      <Modal.Body>
        <Text size="h5" fontWeight="medium" className="mb-24">
          CONNECT REQUEST
        </Text>
        <Text size="large" color="text1">
          Approve this request to prove you have access to this wallet and you can start to use{' '}
          <a href={requestData?.redirectURL} target="_blank">
            {requestData?.redirectURL}
          </a>
          .
        </Text>
        <div className="btn-wrapper">
          <Button2 className="btn" type="button" variants="outline" onClick={onHide}>
            Cancel
          </Button2>
          <Button2 className="btn" onClick={onConnect}>
            Connect
          </Button2>
        </div>
      </Modal.Body>
    </StyledSignModal>
  );
});

export default ModalConfirmRequestDapp;
