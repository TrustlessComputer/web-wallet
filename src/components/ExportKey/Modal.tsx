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
  privateKey: string | undefined;
  address: string | undefined;
  onHide: () => void;
}

const ExportKeyModal = React.memo(({ privateKey, onHide, address }: IProps) => {
  const onClickCopy = (text: string | null) => {
    if (!text) return;
    copy(text);
    toast.success('Copied');
  };
  return (
    <StyledSendBTCModal show={!!privateKey && !!address} centered>
      <Modal.Header>
        <IconSVG className="cursor-pointer scale-up-anim" onClick={onHide} src={IcCloseModal} maxWidth="22px" />
      </Modal.Header>
      <Modal.Body>
        <Text size="h5" className="font-medium mb-12 header-title">
          Private Key
        </Text>
        <ItemWrapper>
          <Text style={{ lineBreak: 'anywhere' }} size="medium">
            {privateKey}
          </Text>
          <div className="icCopy" onClick={() => onClickCopy(privateKey || '')}>
            <img alt="ic-copy" src={IcCopy} />
          </div>
        </ItemWrapper>

        <Text size="h5" className="font-medium mb-12 mt-32 header-title">
          Address
        </Text>
        <ItemWrapper>
          <Text style={{ lineBreak: 'anywhere' }} size="medium">
            {address}
          </Text>
          <div className="icCopy" onClick={() => onClickCopy(address || '')}>
            <img alt="ic-copy" src={IcCopy} />
          </div>
        </ItemWrapper>
      </Modal.Body>
    </StyledSendBTCModal>
  );
});

export default ExportKeyModal;
