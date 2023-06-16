import React from 'react';
import useBitcoin from '@/hooks/useBitcoin';
import useAsyncEffect from 'use-async-effect';
import { useCurrentUser } from '@/state/user/hooks';
import { Container, WrapperTx } from '@/components/SpeedUp/Modal.styled';
import { Formik } from 'formik';
import Text from '@/components/Text';
import { Modal, Row } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import Button2 from '@/components/Button2';
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
import { getErrorMessage } from '@/utils/error';
import { initEccLib, networks } from 'bitcoinjs-lib';
import * as ecc from '@bitcoinerlab/secp256k1';
import { ECPairAPI, ECPairFactory } from 'ecpair';
import * as TC_SDK from 'trustless-computer-sdk';
import { BTC_NETWORK } from '@/utils/commons';
import { TC_NETWORK_RPC } from '@/configs';

interface IProps {
  show: boolean;
  onHide: (isSuccess: boolean) => void;
  title?: string;
  buttonText?: string;
  speedUpTx: ISpeedUpTx | undefined;
}

initEccLib(ecc);
const ECPair: ECPairAPI = ECPairFactory(ecc);

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

  const { createSpeedUpBTCTx } = useBitcoin();

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
      const { desc } = getErrorMessage(err, 'Speedup');
      toast.error(desc);
    } finally {
      setSubmitting(false);
    }
  };

  const onGetHexSize = async () => {
    try {
      setIsLoading(true);
      const hashLockKeyPair = ECPair.makeRandom({ network: networks.bitcoin });

      const tcClient = new TC_SDK.TcClient(BTC_NETWORK, TC_NETWORK_RPC);
      const { hashLockScriptHex } = await tcClient.getTapScriptInfo(
        hashLockKeyPair.publicKey.toString('hex'),
        (speedUpTx?.tcTxs || []).map(tx => tx.Hash),
      );
      setSizeByte(Web3.utils.hexToBytes(hashLockScriptHex).length);
      // setSizeByte(sizeByte);
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
        <IconSVG
          className="cursor-pointer scale-up-anim"
          onClick={() => onHide(false)}
          src={IcCloseModal}
          maxWidth="22px"
        />
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
                  <Button2 variants="outline" type="button" className="btn" onClick={() => onHide(false)}>
                    Cancel
                  </Button2>
                  <Button2 type="submit" className="btn" disabled={submitting || isLoading || isLoadingRate || !!error}>
                    {submitting ? 'Processing...' : buttonText}
                  </Button2>
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
