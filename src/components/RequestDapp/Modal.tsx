import React from 'react';
import { StyledSignModal } from '@/components/SignTransaction/Modal.styled';
import Text from '@/components/Text';
import { Modal } from 'react-bootstrap';
import Button from '@/components/Button';
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
        <IconSVG className="cursor-pointer" onClick={onHide} src={IcCloseModal} maxWidth={'22px'} />
      </Modal.Header>
      <Modal.Body>
        <Text size="h5" className="font-medium mb-24">
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
          <Button type="button" className="btn-cancel" onClick={onHide}>
            <Text size="medium" fontWeight="medium" className="text-cancel">
              Cancel
            </Text>
          </Button>
          <Button className="btn-submit" onClick={onConnect}>
            <Text color="text8" size="medium" fontWeight="medium">
              Connect
            </Text>
          </Button>
        </div>
      </Modal.Body>
    </StyledSignModal>
  );
});

export default ModalConfirmRequestDapp;
