import React from 'react';
import { ItemWrapper, StyledSendBTCModal } from '@/components/ExportKey/Modal.styled';
import Text from '@/components/Text';
import { Modal } from 'react-bootstrap';
import IconSVG from '@/components/IconSVG';
import IcCloseModal from '@/assets/icons/ic-close.svg';
import IcCopy from '@/assets/icons/ic-copy-outline.svg';
import copy from 'copy-to-clipboard';
import { toast } from 'react-hot-toast';

interface IProps {
  privateKey: string | null;
  onHide: () => void;
}

const ExportKeyModal = React.memo(({ privateKey, onHide }: IProps) => {
  const onClickCopy = (text: string | null) => {
    if (!text) return;
    copy(text);
    toast.success('Copied');
  };
  return (
    <StyledSendBTCModal show={!!privateKey} centered>
      <Modal.Header>
        <IconSVG className="cursor-pointer" onClick={onHide} src={IcCloseModal} maxWidth="22px" />
      </Modal.Header>
      <Modal.Body>
        <Text size="h5" className="font-medium mb-24 header-title">
          Private Key
        </Text>
        <ItemWrapper>
          <Text style={{ lineBreak: 'anywhere' }} size="medium">
            {privateKey}
          </Text>
          <div className="icCopy" onClick={() => onClickCopy(privateKey)}>
            <img alt="ic-copy" src={IcCopy} />
          </div>
        </ItemWrapper>
      </Modal.Body>
    </StyledSendBTCModal>
  );
});

export default ExportKeyModal;
