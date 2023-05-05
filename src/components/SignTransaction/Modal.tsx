import React from 'react';
import useBitcoin from '@/hooks/useBitcoin';
import useAsyncEffect from 'use-async-effect';
import { useCurrentUser } from '@/state/user/hooks';
import { StyledSignModal, WrapperTx } from '@/components/SignTransaction/Modal.styled';
import { Formik } from 'formik';
import Text from '@/components/Text';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import Button from '@/components/Button';
import WError, { ERROR_CODE } from '@/utils/error';
import * as TC_SDK from 'trustless-computer-sdk';
import debounce from 'lodash/debounce';
import LoadingContainer from '@/components/Loader';
import { ellipsisCenter } from '@/utils';
import Table from '@/components/Table';
import { ITCTxDetail } from '@/interfaces/transaction';
import bitcoinStorage from '@/utils/bitcoin-storage';
import Web3 from 'web3';
import { triggerHash } from '@/services/bridgeClient';
import { FeeRate } from '@/components/FeeRate';
import useFeeRate from '@/components/FeeRate/useFeeRate';

const TABLE_HEADINGS = ['Hash', 'Event type', 'Dapp URL'];

interface IProps {
  show: boolean;
  onHide: (isSuccess: boolean) => void;
  signData?: TC_SDK.CallWalletPayload;
  title?: string;
  buttonText?: string;
}

const ModalSignTx = React.memo(
  ({ show, onHide, signData, title = 'SIGN TRANSACTION', buttonText = 'Sign' }: IProps) => {
    const {
      feeRate,
      onChangeFee,
      onChangeCustomFee,
      currentRateType,
      currentRate,
      customRate,
      isLoading: isLoadingRate,
      onFetchFee,
    } = useFeeRate();

    const [isLoading, setIsLoading] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const [pendingTxs, setPendingTxs] = React.useState<ITCTxDetail[]>([]);
    const user = useCurrentUser();
    const [sizeByte, setSizeByte] = React.useState<number | undefined>(undefined);

    const { getUnInscribedTransactionDetailByAddress, createBatchInscribeTxs, getTCTransactionByHash } = useBitcoin();

    const debounceTriggerHash = React.useCallback(debounce(triggerHash, 1000), []);

    const getPendingTxs = async () => {
      try {
        if (!user) {
          throw new WError(ERROR_CODE.EMPTY_USER);
        }
        setIsLoading(true);
        let pendingTxs = (await getUnInscribedTransactionDetailByAddress(user.walletAddress)).map(tx => {
          if (!signData?.hash || tx.Hash.toLowerCase() !== signData.hash.toLowerCase()) return tx;
          return {
            ...tx,
            dappURL: signData.dappURL,
            method: signData.method,
          };
        });

        if (signData && signData.hash) {
          if (!pendingTxs || pendingTxs.length === 0) {
            debounceTriggerHash(signData.hash, user.walletAddress);
          }
          const _signTx = pendingTxs.find(tx => tx.Hash.toLowerCase() === signData.hash.toLowerCase());
          if (_signTx) {
            bitcoinStorage.updateStorageTransaction(user.walletAddress, {
              ..._signTx,
            });
          }
        }
        setPendingTxs(pendingTxs);
        const Hexs = await Promise.all(
          pendingTxs.map(({ Hash }) => {
            return getTCTransactionByHash(Hash);
          }),
        );
        const sizeByte: number = Hexs.reduce((prev, curr) => {
          const currSize = Web3.utils.hexToBytes(curr).length;
          return currSize + prev;
        }, 0);
        setSizeByte(sizeByte);
      } catch (e) {
        // handle error
      } finally {
        setIsLoading(false);
      }
    };

    const debounceGetPendingTxs = React.useCallback(debounce(getPendingTxs, 200), [user?.walletAddress, signData]);

    const handleSubmit = async () => {
      try {
        setSubmitting(true);
        const resp = await createBatchInscribeTxs({
          tcTxDetails: [...pendingTxs],
          feeRatePerByte: currentRate,
        });
        for (const submited of resp) {
          const { tcTxIDs, revealTxID } = submited;
          pendingTxs.forEach(tx => {
            const isExist = tcTxIDs.some(hash => hash.toLowerCase() === tx.Hash.toLowerCase());
            if (isExist) {
              bitcoinStorage.updateStorageTransaction(user?.walletAddress || '', {
                ...tx,
                statusCode: 1,
                btcHash: revealTxID,
              });
            }
          });
        }
        toast.success('Sign transaction successfully');
        onHide(true);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setSubmitting(false);
      }
    };

    const tokenDatas =
      (pendingTxs &&
        pendingTxs.length > 0 &&
        pendingTxs.map(tx => {
          return {
            id: `transaction-${tx?.Hash}}`,
            render: {
              hash: (
                <Text color="text1" size="medium">
                  {ellipsisCenter({ str: tx.Hash, limit: 5 })}
                </Text>
              ),
              event: (
                <Text color="text1" size="medium">
                  {tx.method || '-'}
                </Text>
              ),
              url: tx.dappURL ? (
                <a href={tx.dappURL} target="_blank">
                  <Text color="text1" size="medium">
                    {tx.dappURL || '-'}
                  </Text>
                </a>
              ) : (
                '-'
              ),
            },
          };
        })) ||
      [];

    useAsyncEffect(async () => {
      debounceGetPendingTxs();
    }, [user?.walletAddress, signData]);
    useAsyncEffect(async () => {
      if (show) {
        debounceGetPendingTxs();
        onFetchFee();
      }
    }, [show]);

    return (
      <StyledSignModal show={show} centered>
        <Modal.Body>
          <Text style={{ textTransform: 'uppercase' }} size="h5" className="font-medium mb-24 header-title">
            {title}
          </Text>
          <Formik key="sign" initialValues={{}} onSubmit={handleSubmit}>
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <div className="container">
                  <WrapperTx>
                    {!isLoading && !!pendingTxs.length && (
                      <>
                        <Table tableHead={TABLE_HEADINGS} data={tokenDatas} className={'token-table'} />
                      </>
                    )}
                  </WrapperTx>
                  <FeeRate
                    allRate={feeRate}
                    isCustom={true}
                    onChangeFee={onChangeFee}
                    onChangeCustomFee={onChangeCustomFee}
                    currentRateType={currentRateType}
                    currentRate={currentRate}
                    customRate={customRate}
                    isLoading={isLoadingRate || isLoading}
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
                    <Button type="submit" className="btn-submit" disabled={submitting || isLoading || isLoadingRate}>
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
      </StyledSignModal>
    );
  },
);

export default ModalSignTx;
