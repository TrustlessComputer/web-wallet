import React, { useState } from 'react';
import { useCurrentUser } from '@/state/user/hooks';
import { IStatusCode, ITCTxDetail } from '@/interfaces/transaction';
import { debounce } from 'lodash';
import useBitcoin from '@/hooks/useBitcoin';
import bitcoinStorage from '@/utils/bitcoin-storage';
import { StyledTransactionProfile } from '@/modules/Wallet/TransactionsProfile/TransactionsProfile.styled';
import Table from '@/components/Table';
import { formatLongAddress } from '@/utils';
import copy from 'copy-to-clipboard';
import { toast } from 'react-hot-toast';
import IcCopy from '@/assets/icons/ic-copy.svg';
import Text from '@/components/Text';
import * as TC_SDK from 'trustless-computer-sdk';
import { TC_NETWORK_RPC } from '@/configs';
import Spinner from '@/components/Spinner';
import { formatUnixDateTime } from '@/utils/time';
import { BTC_NETWORK } from '@/utils/commons';
import Button from '@/components/Button';
import { ModalSignTx } from '@/components/SignTransaction';
import ModalSpeedUp from '@/components/SpeedUp/Modal';

const TABLE_HEADINGS = ['Event', 'Transaction ID', 'From', 'To', 'Time', 'Status'];

export enum TransactionStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Confirmed = 'Confirmed',
  Failed = 'Failed',
  Success = 'Success',
}

export interface ISpeedUpTx {
  btcHash: string;
  tcTxs: ITCTxDetail[];
  currentRate: number;
  minRate: number;
}

const Transactions = React.memo(() => {
  const user = useCurrentUser();
  const [transactions, setTransactions] = useState<ITCTxDetail[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { getUnInscribedTransactionDetailByAddress, isRBFable } = useBitcoin();
  const [isShow, setIsShow] = React.useState(false);
  const [isShowModalSpeedup, setIsShowModalSpeedup] = React.useState(false);
  const [speedUpTx, setSpeedUpTx] = React.useState<ISpeedUpTx | undefined>(undefined);

  const numbPending = React.useMemo(() => {
    return transactions.filter(item => item.statusCode === 0).length;
  }, [transactions]);

  const onHide = (isSuccess: boolean) => {
    setIsShow(false);
    if (isSuccess) {
      setTimeout(() => {
        debounceGetTransactions();
      }, 1000);
    }
  };

  const onHideModalSpeedUp = (isSuccess: boolean) => {
    setIsShowModalSpeedup(false);
    setSpeedUpTx(undefined);
    if (isSuccess) {
      setTimeout(() => {
        debounceGetTransactions();
      }, 1000);
    }
  };

  const handleResumeTransactions = async () => {
    setIsShow(true);
  };

  const handleSpeedUp = async (btcHash: string) => {
    setIsShowModalSpeedup(true);
    const tcTxs = transactions.filter(trans => trans.btcHash && trans.btcHash.toLowerCase() === btcHash.toLowerCase());
    const tx = tcTxs.find(tx => !!tx.feeRate);
    setSpeedUpTx({
      btcHash,
      tcTxs,
      currentRate: tx?.feeRate || 0,
      minRate: tx?.minSat || 0,
    });
  };

  const getStatusCode = async (txHash: string, tcAddress: string): Promise<IStatusCode> => {
    if (tcAddress) {
      try {
        const tcClient = new TC_SDK.TcClient(BTC_NETWORK, TC_NETWORK_RPC);
        const res = await tcClient.getTCTxByHash(txHash);
        if (res && res.blockHash) {
          if (res.blockHash === '0x0') {
            return 3;
          }
          return 2;
        }
      } catch (e) {
        // handle error
      }
    }
    return 1;
  };

  const getTransactions = async () => {
    try {
      if (!user) return;
      setIsLoading(true);
      const pendingTxs = await getUnInscribedTransactionDetailByAddress(user.walletAddress);
      const storageTxs = bitcoinStorage.getStorageTransactions(user.walletAddress);

      // map pending history
      const _pendingTxs = pendingTxs.map(tx => {
        const { Hash } = tx;
        const localTx = storageTxs.find(local => local.Hash.toLowerCase() === Hash.toLowerCase());
        if (!localTx) return tx;
        return {
          ...localTx,
          ...tx,
        };
      });

      // map local history
      const localFilter = storageTxs.filter(local => {
        const hash = local.Hash.toLowerCase();
        return !pendingTxs.some(tx => tx.Hash.toLowerCase() === hash.toLowerCase());
      });

      const localTxs = [];
      for (const local of localFilter) {
        const hash = local.Hash;
        let shouldUpdateStorage = local?.statusCode !== 2 && local?.statusCode !== 3;
        const statusCode =
          local?.statusCode === 2 || local?.statusCode === 3
            ? local?.statusCode
            : await getStatusCode(hash, user.walletAddress);
        let _isRBFable = false;
        let _currentRate = 0;
        let _minSat = 0;
        if (local.btcHash && local.statusCode === 1) {
          const {
            isRBFable: canReplace,
            oldFeeRate: currentRate,
            minSat,
          } = await isRBFable({
            btcHash: local.btcHash,
            btcAddress: user.walletAddressBtcTaproot,
            tcAddress: user.walletAddress,
          });
          _isRBFable = canReplace;
          _currentRate = currentRate;
          _minSat = minSat;
        }

        const _tx = {
          ...local,
          statusCode,
          isRBFable: _isRBFable,
          feeRate: _currentRate,
          minSat: _minSat,
        };

        if ((statusCode === 2 || statusCode === 3) && shouldUpdateStorage) {
          bitcoinStorage.updateStorageTransaction(user.walletAddress, {
            ..._tx,
            statusCode: statusCode,
          });
        }
        localTxs.push(_tx);
      }

      const txs = [..._pendingTxs, ...localTxs];
      // set transactions
      setTransactions(txs);
    } catch (e) {
      // handle error
    } finally {
      setIsLoading(false);
    }
  };

  const debounceGetTransactions = React.useCallback(debounce(getTransactions, 300), [user?.walletAddress]);

  const transactionsData = transactions?.map(trans => {
    const method = trans.method ? trans.method.charAt(0).toUpperCase() + trans.method.slice(1) : '-';
    const linkToMempool = `https://mempool.space/tx/${trans?.btcHash || ''}`;
    const statusCode = trans.statusCode;

    let status = TransactionStatus.Processing;
    switch (statusCode) {
      case 0:
        status = TransactionStatus.Pending;
        break;
      case 1:
        status = TransactionStatus.Processing;
        break;
      case 2:
        status = TransactionStatus.Confirmed;
        break;
      case 3:
        status = TransactionStatus.Failed;
        break;
    }
    let statusComp = undefined;
    if (trans.btcHash !== undefined && trans.statusCode !== 3) {
      const mesg = statusCode === 2 ? TransactionStatus.Success : 'Waiting in the mempool';
      statusComp = (
        <a
          className={`status ${status.toLowerCase()}`}
          target="_blank"
          style={{ textDecoration: trans.btcHash ? 'underline' : 'unset' }}
          href={
            statusCode === 2
              ? `https://explorer.trustless.computer/tx/${trans.Hash}`
              : `https://mempool.space/tx/${trans.btcHash}`
          }
        >
          {mesg}
        </a>
      );
    }

    const localDateString = trans?.time
      ? formatUnixDateTime({
          dateTime: Number(trans.time) / 1000,
        })
      : '-';

    return {
      id: trans.Hash,
      render: {
        type: method,
        tx_id: (
          <div className="id-wrapper">
            <div className="tx-wrapper">
              <div className={`tx-id`}>{formatLongAddress(trans.Hash)}</div>
              <div
                className="icCopy"
                onClick={() => {
                  copy(trans.Hash);
                  toast.success('Copied');
                }}
              >
                <img alt="ic-copy" src={IcCopy} />
              </div>
            </div>
            <Text color="bg4" size="regular">
              BTC:{' '}
              {trans.btcHash ? (
                <a className="tx-link" target="_blank" href={linkToMempool}>
                  {formatLongAddress(trans?.btcHash)}
                </a>
              ) : (
                '--'
              )}
            </Text>
          </div>
        ),
        fromAddress: formatLongAddress(trans.From) || '-',
        toAddress: formatLongAddress(trans.To) || '-',
        time: (
          <>
            {localDateString}
            <Text color="bg4" size="regular">
              Nonce: {trans.Nonce}
            </Text>
          </>
        ),
        status:
          statusCode === 0 ? (
            <Button bg="bg6" className="resume-btn" type="button" onClick={handleResumeTransactions}>
              Process
            </Button>
          ) : (
            <>
              <div className={`status ${status.toLowerCase()}`}>{statusComp ? statusComp : status}</div>
              {!!trans.btcHash && !!trans.isRBFable && !!trans.feeRate && (
                <Button
                  bg="bg6"
                  className="speedup-btn"
                  type="button"
                  onClick={() => {
                    handleSpeedUp(trans.btcHash!);
                  }}
                >
                  Speed up
                </Button>
              )}
            </>
          ),
      },
    };
  });

  React.useEffect(() => {
    debounceGetTransactions();
    let interval = setInterval(() => {
      debounceGetTransactions();
    }, 20000);
    return () => {
      clearInterval(interval);
    };
  }, [user?.walletAddress]);

  return (
    <StyledTransactionProfile>
      {!!numbPending && (
        <div className="header-wrapper">
          <Text size="h5">{`You have ${numbPending} incomplete ${
            numbPending === 1 ? 'transaction' : 'transactions'
          }`}</Text>
          <Button bg="bg6" className="process-btn" type="button" onClick={handleResumeTransactions}>
            Process them now
          </Button>
        </div>
      )}
      {isLoading && <Spinner />}
      <Table tableHead={TABLE_HEADINGS} data={transactionsData} className={'transaction-table'} />
      <ModalSignTx show={isShow} onHide={onHide} title="Process pending transactions" buttonText="Process now" />
      <ModalSpeedUp show={isShowModalSpeedup && !!speedUpTx} speedUpTx={speedUpTx} onHide={onHideModalSpeedUp} />
    </StyledTransactionProfile>
  );
});

export default Transactions;
