import { Modal } from 'react-bootstrap';
import { StyledTransferModal } from './TransferModal.styled';
import IconSVG from '@/components/IconSVG';
import IcCloseModal from '@/assets/icons/ic-close.svg';
import { Input } from '@/components/Inputs';
import { Formik } from 'formik';
import Text from '@/components/Text';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import useTransferName from '@/hooks/contract-operations/bns/useTransferName';
import Button2 from '@/components/Button2';
import { validateEVMAddress } from '@/utils';

type Props = {
  show: boolean;
  handleClose: () => void;
  name: string;
};

type IFormValue = {
  address: string;
};

const BNSTransferModal = (props: Props) => {
  const { show, handleClose, name } = props;
  const [isProcessing, setIsProcessing] = useState(false);
  const { run } = useContractOperation({
    operation: useTransferName,
  });

  const validateForm = (values: IFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.address) {
      errors.address = 'Receiver wallet address is required.';
    } else if (!validateEVMAddress(values.address)) {
      errors.address = 'Invalid receiver wallet address.';
    }

    return errors;
  };

  const handleSubmit = async (values: IFormValue): Promise<void> => {
    const { address } = values;
    try {
      setIsProcessing(true);
      await run({
        to: address,
        name: name,
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
    <StyledTransferModal show={show} onHide={handleClose} centered>
      <Modal.Header>
        <IconSVG className="cursor-pointer scale-up-anim" onClick={handleClose} src={IcCloseModal} maxWidth="22px" />
      </Modal.Header>
      <Modal.Body>
        <Text className="mb-16" size="h5">
          Transfer Name
        </Text>
        <Formik
          key="transfer"
          initialValues={{
            address: '',
          }}
          validate={validateForm}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Input
                title="TRANSFER NAME TO"
                id="address"
                type="text"
                name="address"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.address}
                className="input"
                placeholder={`Paste TC wallet address here`}
                errorMsg={errors.address && touched.address ? errors.address : undefined}
              />
              <Button2 disabled={isProcessing} type="submit" className="transfer-btn mt-24">
                {isProcessing ? 'Processing...' : 'Transfer'}
              </Button2>
            </form>
          )}
        </Formik>
      </Modal.Body>
    </StyledTransferModal>
  );
};

export default BNSTransferModal;
