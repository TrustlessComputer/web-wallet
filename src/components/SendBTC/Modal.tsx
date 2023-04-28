import React, { useContext } from 'react';
import { StyledSendBTCModal, WrapInput } from '@/components/SendBTC/Modal.styled';
import { Formik } from 'formik';
import Text from '@/components/Text';
import { Modal } from 'react-bootstrap';
import { AssetsContext } from '@/contexts/assets-context';
import Button from '@/components/Button';
import IconSVG from '@/components/IconSVG';
import IcCloseModal from '@/assets/icons/ic-close.svg';
import { validateBTCAddress } from '@/utils';
import useBitcoin from '@/hooks/useBitcoin';
import { FeeRateName } from '@/interfaces/api/bitcoin';
import { toast } from 'react-hot-toast';
import { formatBTCPrice } from '@/utils/format';
import * as TC_SDK from 'trustless-computer-sdk';

interface IProps {
  show: boolean;
  onHide: () => void;
}

type IFormValue = {
  address: string;
  amount: string;
};

const SendBTCModal = React.memo(({ show, onHide }: IProps) => {
  const { feeRate } = useContext(AssetsContext);
  const [submitting, setSubmitting] = React.useState(false);
  const { sendBTC } = useBitcoin();

  const validateForm = (values: IFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.amount || Number(values.amount) <= 0) {
      errors.amount = 'Required.';
    }

    if (!values.amount) {
      errors.amount = 'Required.';
    }

    if (!values.address) {
      errors.address = 'Required.';
    }

    if (!validateBTCAddress(values.address)) {
      errors.address = 'Invalid wallet address.';
    }

    return errors;
  };

  const handleSubmit = async (values: IFormValue): Promise<void> => {
    const { address, amount } = values;
    try {
      setSubmitting(true);
      await sendBTC({
        amount: amount,
        feeRate: feeRate[FeeRateName.fastestFee],
        receiver: address,
      });
      toast.success('Transferred successfully');
      onHide();
    } catch (err) {
      console.log('SANG TEST ERROR: ', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StyledSendBTCModal show={show} centered>
      <Modal.Header>
        <IconSVG className="cursor-pointer" onClick={onHide} src={IcCloseModal} maxWidth="22px" />
      </Modal.Header>
      <Modal.Body>
        <Text size="h5" className="font-medium mb-24 header-title">
          SEND BTC
        </Text>
        <Formik
          key="sign"
          initialValues={{
            address: '',
            amount: '',
          }}
          validate={validateForm}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <WrapInput>
                <label htmlFor="amount" className="label">
                  AMOUNT
                </label>
                <input
                  id="amount"
                  type="number"
                  name="amount"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.amount}
                  className="input"
                  placeholder="0.00"
                />
                {errors.amount && touched.amount && <p className="error">{errors.amount}</p>}
              </WrapInput>
              <WrapInput>
                <label htmlFor="amount" className="label">
                  ADDRESS
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.address}
                  className="input"
                  placeholder="Enter BTC address"
                />
                {errors.address && touched.address && <p className="error">{errors.address}</p>}
              </WrapInput>
              <div className="row-bw">
                <Text size="medium" fontWeight="semibold">
                  Transaction Fee
                </Text>
                <Text size="large" fontWeight="semibold">
                  ~{formatBTCPrice(TC_SDK.estimateTxFee(2, 2, Number(feeRate[FeeRateName.fastestFee])))} BTC
                </Text>
              </div>
              <Button disabled={submitting} type="submit" className="transfer-btn">
                <Text size="medium" fontWeight="medium" className="transfer-text">
                  {submitting ? 'Processing...' : 'Send'}
                </Text>
              </Button>
            </form>
          )}
        </Formik>
      </Modal.Body>
    </StyledSendBTCModal>
  );
});

export default SendBTCModal;
