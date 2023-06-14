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
import { getErrorMessage } from '@/utils/error';
import BigNumber from 'bignumber.js';
import format from '@/utils/amount';

interface IProps {
  show: boolean;
  onHide: () => void;
}

type IFormValue = {
  address: string;
  amount: string;
};

const SendBTCModal = React.memo(({ show, onHide }: IProps) => {
  const { feeRate, assets, fetchFeeRate, btcBalance } = useContext(AssetsContext);
  const [submitting, setSubmitting] = React.useState(false);
  const { sendBTC } = useBitcoin();

  const estimateFee = React.useMemo(() => {
    const fee = TC_SDK.estimateTxFee(
      (assets?.availableUTXOs || []).length || 4,
      2,
      Number(feeRate[FeeRateName.fastestFee]),
    );
    return fee;
  }, [assets?.availableUTXOs, feeRate]);

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
      const { desc } = getErrorMessage(err, 'Send BTC');
      toast.error(desc);
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    fetchFeeRate();
    const interval = setInterval(fetchFeeRate, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <StyledSendBTCModal show={show} centered>
      <Modal.Header>
        <IconSVG className="cursor-pointer scale-up-anim" onClick={onHide} src={IcCloseModal} maxWidth="22px" />
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
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
            <form onSubmit={handleSubmit}>
              <WrapInput>
                <div className="row-header">
                  <label htmlFor="amount" className="label">
                    AMOUNT
                  </label>
                  <label
                    htmlFor="amount"
                    className="label max"
                    onClick={() => {
                      const maxAmount = new BigNumber(btcBalance).minus(estimateFee).toNumber();
                      const maxAmountText = new BigNumber(
                        format.formatAmount({
                          originalAmount: maxAmount,
                          decimals: 8,
                          maxDigits: 6,
                        }),
                      ).toNumber();
                      setFieldValue('amount', maxAmountText <= 0 ? 0 : maxAmountText);
                    }}
                  >
                    MAX
                  </label>
                </div>
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
                  Fee Rate
                </Text>
                <Text size="large" fontWeight="semibold">
                  {feeRate[FeeRateName.fastestFee]}
                </Text>
              </div>
              <div className="row-bw">
                <Text size="medium" fontWeight="semibold">
                  Transaction Fee
                </Text>
                <Text size="large" fontWeight="semibold">
                  ~{formatBTCPrice(estimateFee)} BTC
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
