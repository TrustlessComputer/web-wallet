import React from 'react';
import useBitcoin from '@/hooks/useBitcoin';
import useAsyncEffect from 'use-async-effect';
import { useCurrentUser } from '@/state/user/hooks';
import { StyledSignModal, WrapperTx } from '@/components/SignTransaction/Modal.styled';
import { Formik } from 'formik';
import Text from '@/components/Text';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import Button2 from '@/components/Button2';
import WError, { ERROR_CODE, getErrorMessage } from '@/utils/error';
import * as TC_SDK from 'trustless-computer-sdk';
import debounce from 'lodash/debounce';
import LoadingContainer from '@/components/Loader';
import { ellipsisCenter } from '@/utils';
import Table from '@/components/Table';
import { ITCTxDetail } from '@/interfaces/transaction';
import bitcoinStorage from '@/utils/bitcoin-storage';
import { triggerHash } from '@/services/bridgeClient';
import { FeeRate } from '@/components/FeeRate';
import useFeeRate from '@/components/FeeRate/useFeeRate';
import { BTC_NETWORK, isProduction } from '@/utils/commons';
import { TC_NETWORK_RPC } from '@/configs';
import { initEccLib } from 'bitcoinjs-lib';
import { ECPairAPI, ECPairFactory } from 'ecpair';
import * as ecc from '@bitcoinerlab/secp256k1';
import { networks } from 'bitcoinjs-lib';
import Web3 from 'web3';

const TABLE_HEADINGS = ['Hash', 'Event type', 'Dapp URL'];

initEccLib(ecc);
const ECPair: ECPairAPI = ECPairFactory(ecc);

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
    } = useFeeRate({ minFeeRate: undefined });

    const [isLoading, setIsLoading] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const [pendingTxs, setPendingTxs] = React.useState<ITCTxDetail[]>([]);
    const user = useCurrentUser();
    const [sizeByte, setSizeByte] = React.useState<number | undefined>(undefined);

    const { getUnInscribedTransactionDetailByAddress, createBatchInscribeTxs } = useBitcoin();

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
        const txIDs = pendingTxs.map(tx => tx.Hash);
        const hashLockKeyPair = ECPair.makeRandom({ network: isProduction() ? networks.bitcoin : networks.regtest });
        const tcClient = new TC_SDK.TcClient(BTC_NETWORK, TC_NETWORK_RPC);
        const { hashLockScriptHex } = await tcClient.getTapScriptInfo(hashLockKeyPair.publicKey.toString('hex'), txIDs);
        const sizeByte = Web3.utils.hexToBytes(`0x${hashLockScriptHex}`).length;

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

        if (signData?.isRedirect && signData.dappURL) {
          setTimeout(() => {
            try {
              window.open(signData.dappURL, '_self');
            } catch (e) {
              // to do error
            }
          }, 500);
        }
      } catch (err: any) {
        const { desc } = getErrorMessage(err, 'Send BTC');
        toast.error(desc);
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
      } else {
        setPendingTxs([]);
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
                    {!isLoading && !pendingTxs.length && (
                      <Text size="h5" color="btn3">
                        No transaction for sign.
                      </Text>
                    )}
                  </WrapperTx>
                  {!!pendingTxs.length && (
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
                  )}
                  <div className="btn-wrapper">
                    <Button2 variants="outline" type="button" className="btn" onClick={() => onHide(false)}>
                      Cancel
                    </Button2>
                    <Button2
                      type="submit"
                      className="btn"
                      disabled={submitting || isLoading || isLoadingRate || !pendingTxs.length}
                    >
                      {submitting ? 'Processing...' : buttonText}
                    </Button2>
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
