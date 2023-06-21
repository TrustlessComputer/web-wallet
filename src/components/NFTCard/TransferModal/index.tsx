import IcCloseModal from '@/assets/icons/ic-close.svg';
import Button2 from '@/components/Button2';
import IconSVG from '@/components/IconSVG';
import { Input } from '@/components/Inputs';
import Text from '@/components/Text';
import useTransferERC721Token from '@/hooks/contract-operations/nft/useTransferERC721Token';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import { Formik } from 'formik';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { StyledModalUpload } from './TransferModal.styled';
import { validateEVMAddress } from '@/utils';

type Props = {
  show: boolean;
  handleClose: () => void;
  contractAddress?: string;
  tokenId?: string;
};

interface IFormValue {
  toAddress: string;
}

const TransferModal = (props: Props) => {
  const { show = false, handleClose, contractAddress, tokenId } = props;
  const { run } = useContractOperation({
    operation: useTransferERC721Token,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const validateForm = (values: IFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.toAddress) {
      errors.toAddress = 'Receiver wallet address is required.';
    } else if (!validateEVMAddress(values.toAddress)) {
      errors.toAddress = 'Invalid receiver wallet address.';
    }

    return errors;
  };

  const handleSubmit = async (values: IFormValue): Promise<void> => {
    if (!tokenId || !contractAddress) {
      toast.error('Token information not found');
      setIsProcessing(false);
      return;
    }

    const { toAddress } = values;
    try {
      setIsProcessing(true);
      await run({
        tokenId: tokenId,
        to: toAddress,
        contractAddress: contractAddress,
      });
      toast.success('Transaction has been created. Please wait for few minutes.');
      handleClose();
    } catch (err) {
      toast.error((err as Error).message);
      console.log(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <StyledModalUpload show={show} onHide={handleClose} centered>
      <Modal.Header>
        <IconSVG className="cursor-pointer scale-up-anim" onClick={handleClose} src={IcCloseModal} maxWidth={'22px'} />
      </Modal.Header>
      <Modal.Body>
        <Text className="mb-16" size="h5">
          Transfer NFT
        </Text>

        <Formik
          key="create"
          initialValues={{
            toAddress: '',
          }}
          validate={validateForm}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Input
                title="TRANSFER NFT TO"
                id="toAddress"
                type="text"
                name="toAddress"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.toAddress}
                className="input"
                placeholder={`Paste TC wallet address here`}
                errorMsg={errors.toAddress && touched.toAddress ? errors.toAddress : undefined}
              />

              <Button2 className="confirm-btn mt-24" disabled={isProcessing} type="submit">
                {isProcessing ? 'Processing...' : 'Transfer'}
              </Button2>
            </form>
          )}
        </Formik>
      </Modal.Body>
    </StyledModalUpload>
  );
};

export default TransferModal;
