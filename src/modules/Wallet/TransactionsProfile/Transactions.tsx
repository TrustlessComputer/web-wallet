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

const TABLE_HEADINGS = ['Event', 'Transaction ID', 'From', 'To', 'Time', 'Status'];

export enum TransactionStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Confirmed = 'Confirmed',
  Failed = 'Failed',
}

const Transactions = React.memo(() => {
  const user = useCurrentUser();
  const [transactions, setTransactions] = useState<ITCTxDetail[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const { getUnInscribedTransactionDetailByAddress } = useBitcoin();

  const getStatusCode = async (txHash: string, tcAddress: string): Promise<IStatusCode> => {
    if (tcAddress) {
      try {
        const tcClient = new TC_SDK.TcClient(TC_SDK.Mainnet, TC_NETWORK_RPC);
        const res = await tcClient.getTCTxByHash(txHash);
        if (res && res.blockHash) {
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
        let shouldUpdateStorage = local?.statusCode !== 2;
        const statusCode = local?.statusCode === 2 ? 2 : await getStatusCode(hash, user.walletAddress);
        const _tx = {
          ...local,
          statusCode,
        };
        if (statusCode === 2 && shouldUpdateStorage) {
          bitcoinStorage.updateStorageTransaction(user.walletAddress, {
            ..._tx,
            statusCode: 2,
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
    }

    const localDateString = trans?.time
      ? formatUnixDateTime({
          dateTime: Number(trans.time) / 1000,
        })
      : '-';

    return {
      id: trans.Hash,
      render: {
        type: trans.method || '-',
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
        time: localDateString,
        status: <div className={`status ${status.toLowerCase()}`}>{status}</div>,
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
      {isLoading && <Spinner />}
      <Table tableHead={TABLE_HEADINGS} data={transactionsData} className={'transaction-table'} />
    </StyledTransactionProfile>
  );
});

export default Transactions;
