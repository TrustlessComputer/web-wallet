import React from 'react';
import useBitcoin from '@/hooks/useBitcoin';
import useAsyncEffect from 'use-async-effect';
import { useCurrentUser } from '@/state/user/hooks';
import { Container, WrapperTx } from '@/components/SpeedUp/Modal.styled';
import { Formik } from 'formik';
import Text from '@/components/Text';
import { Modal, Row } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import Button from '@/components/Button';
import LoadingContainer from '@/components/Loader';
import bitcoinStorage from '@/utils/bitcoin-storage';
import { FeeRate } from '@/components/FeeRate';
import useFeeRate from '@/components/FeeRate/useFeeRate';
import IconSVG from '@/components/IconSVG';
import IcCloseModal from '@/assets/icons/ic-close.svg';
import { ISpeedUpTx } from '@/modules/Wallet/TransactionsProfile/Transactions';
import { ellipsisCenter } from '@/utils';
import Web3 from 'web3';
import copy from 'copy-to-clipboard';
import IcCopy from '@/assets/icons/ic-copy.svg';

interface IProps {
  show: boolean;
  onHide: (isSuccess: boolean) => void;
  title?: string;
  buttonText?: string;
  speedUpTx: ISpeedUpTx | undefined;
}

const ModalSpeedUp = React.memo(({ show, onHide, title = 'Speed up', buttonText = 'Confirm', speedUpTx }: IProps) => {
  const {
    feeRate,
    onChangeFee,
    onChangeCustomFee,
    currentRateType,
    currentRate,
    customRate,
    isLoading: isLoadingRate,
    onFetchFee,
    error,
  } = useFeeRate({ minFeeRate: speedUpTx?.minRate });
  const [sizeByte, setSizeByte] = React.useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const user = useCurrentUser();

  const { createSpeedUpBTCTx, getTCTransactionByHash } = useBitcoin();

  const handleSubmit = async () => {
    try {
      if (!speedUpTx || !speedUpTx?.btcHash) {
        throw new Error('BTC Hash empty.');
      }
      if (!user?.walletAddress) {
        throw new Error('Address empty.');
      }
      if (speedUpTx) {
        setSubmitting(true);
        const newBTCHash = await createSpeedUpBTCTx({
          btcHash: speedUpTx.btcHash,
          feeRate: currentRate,
          tcAddress: user.walletAddress,
          btcAddress: user.walletAddressBtcTaproot,
        });
        bitcoinStorage.updateSpeedUpBTCHash(newBTCHash, speedUpTx.btcHash, user?.walletAddress!);
        toast.success('Sign transaction successfully');
        onHide(true);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const onGetHexSize = async () => {
    try {
      setIsLoading(true);
      const Hexs = await Promise.all(
        (speedUpTx?.tcTxs || []).map(({ Hash }) => {
          return getTCTransactionByHash(Hash);
        }),
      );
      const sizeByte: number = Hexs.reduce((prev, curr) => {
        const currSize = Web3.utils.hexToBytes(curr).length;
        return currSize + prev;
      }, 0);
      setSizeByte(sizeByte);
      setIsLoading(false);
    } catch (e) {
      // todo
      toast.error('Load transaction hash error.');
      setIsLoading(false);
    }
  };

  useAsyncEffect(async () => {
    if (show) {
      onFetchFee();
      onGetHexSize();
    }
  }, [show]);

  return (
    <Container show={show} centered>
      <Modal.Header>
        <IconSVG className="cursor-pointer" onClick={() => onHide(false)} src={IcCloseModal} maxWidth="22px" />
      </Modal.Header>
      <Modal.Body>
        <Text style={{ textTransform: 'uppercase' }} size="h5" className="font-medium mb-24 header-title">
          {title}
        </Text>
        <Formik key="sign" initialValues={{}} onSubmit={handleSubmit}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div className="container">
                {!!speedUpTx && (
                  <WrapperTx>
                    <div className="row-bw">
                      <Text size="large">BTC:</Text>
                      <Row style={{ display: 'flex', flexDirection: 'row' }}>
                        <Text size="large" className="tc-hash">
                          <a href={`https://mempool.space/tx/${speedUpTx.btcHash}`} target="_blank">
                            {ellipsisCenter({ str: speedUpTx.btcHash, limit: 6 })}
                          </a>
                        </Text>
                        <div
                          className="icCopy"
                          onClick={() => {
                            copy(speedUpTx.btcHash);
                            toast.success('Copied');
                          }}
                        >
                          <img alt="ic-copy" src={IcCopy} />
                        </div>
                      </Row>
                    </div>
                    <div className="row-bw">
                      <Text size="large">TC:</Text>
                      <div>
                        {speedUpTx.tcTxs.map(tran => (
                          <Row style={{ display: 'flex', flexDirection: 'row' }}>
                            <Text size="large" key={tran.Hash} className="tc-hash">
                              <a href={`https://explorer.trustless.computer/tx/${tran.Hash}`} target="_blank">
                                {ellipsisCenter({ str: tran.Hash, limit: 6 })}
                              </a>
                            </Text>
                            <div
                              className="icCopy"
                              onClick={() => {
                                copy(tran.Hash);
                                toast.success('Copied');
                              }}
                            >
                              <img alt="ic-copy" src={IcCopy} />
                            </div>
                          </Row>
                        ))}
                      </div>
                    </div>
                    <div className="row-bw">
                      <Text size="large">Current sats:</Text>
                      <Text size="large" className="tc-hash">
                        {speedUpTx.currentRate}
                      </Text>
                    </div>
                    <div className="row-bw">
                      <Text size="large">Min sats:</Text>
                      <Text size="large" className="tc-hash">
                        {speedUpTx.minRate + 1}
                      </Text>
                    </div>
                  </WrapperTx>
                )}
                <FeeRate
                  allRate={feeRate}
                  isCustom={true}
                  onChangeFee={onChangeFee}
                  onChangeCustomFee={onChangeCustomFee}
                  currentRateType={currentRateType}
                  currentRate={currentRate}
                  customRate={customRate}
                  isLoading={isLoadingRate || isLoading}
                  minRate={speedUpTx?.minRate}
                  error={error}
                  options={{
                    type: 'inscribe',
                    sizeByte: sizeByte,
                  }}
                />
                <div className="btn-wrapper">
                  <Button type="button" className="btn-cancel" onClick={() => onHide(false)}>
                    <Text size="medium" fontWeight="medium" className="text-cancel">
                      Cancel
                    </Text>
                  </Button>
                  <Button
                    type="submit"
                    className="btn-submit"
                    disabled={submitting || isLoading || isLoadingRate || !!error}
                  >
                    <Text color="text8" size="medium" fontWeight="medium">
                      {submitting ? 'Processing...' : buttonText}
                    </Text>
                  </Button>
                  <LoadingContainer loaded={!isLoading && !submitting} />
                </div>
              </div>
            </form>
          )}
        </Formik>
      </Modal.Body>
    </Container>
  );
});

export default ModalSpeedUp;