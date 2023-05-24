import { TAPROOT_ADDRESS } from '@/constants/storage-key';
import localStorage from '@/utils/localstorage';
import { IStoredSign, IStoredSignValue, ITCTxDetail } from '@/interfaces/transaction';
import { orderBy } from 'lodash';

class BitCoinStorage {
  private getUserTaprootKey = (evmAddress: string) => {
    return `${TAPROOT_ADDRESS}-${evmAddress.toLowerCase()}`;
  };

  getUserTaprootAddress = (evmAddress: string): string | null => {
    const key = this.getUserTaprootKey(evmAddress);
    return localStorage.get<string | null>(key);
  };

  setUserTaprootAddress = (evmAddress: string, taprootAddress: string) => {
    const key = this.getUserTaprootKey(evmAddress);
    return localStorage.set(key, taprootAddress);
  };

  removeUserTaprootAddress = (evmAddress: string) => {
    const key = this.getUserTaprootKey(evmAddress);
    return localStorage.remove(key);
  };

  // transactions...
  private getTxsKey = (tcAddress: string) => {
    return `transactions-${tcAddress.toLowerCase()}`;
  };
  getStorageTransactions = (tcAddress: string): ITCTxDetail[] => {
    const key = this.getTxsKey(tcAddress);
    const txs = (localStorage.get(key) || []) as ITCTxDetail[];
    const signs = this.getStoredSigns(tcAddress);
    const _txs = txs.map(tx => {
      const signData = signs[tx.Hash] || signs[tx.Hash.toLowerCase()];
      if (!signData) return tx;
      const { time, dappURL, method } = signData;
      return {
        ...tx,
        time,
        dappURL,
        method,
      };
    });
    return orderBy(_txs, item => Number(item.Nonce || 0), 'desc');
  };
  addStorageTransactions = (tcAddress: string, tx: ITCTxDetail, isUpdateTime = true) => {
    const key = this.getTxsKey(tcAddress);
    const txs = this.getStorageTransactions(tcAddress);
    const time = isUpdateTime ? new Date().getTime() : undefined;
    txs?.push({
      ...tx,
      time: `${time}`,
    });
    localStorage.set(key, txs);
  };
  updateStorageTransaction = (tcAddress: string, tx: ITCTxDetail, isUpdateTime = true) => {
    if (!tcAddress) return;
    const key = this.getTxsKey(tcAddress);
    const txs = this.getStorageTransactions(tcAddress);
    const index = txs.findIndex(p => p.Hash.toLowerCase() === tx.Hash.toLowerCase());
    if (index !== -1) {
      txs[index] = tx;
      localStorage.set(key, txs);
    } else {
      this.addStorageTransactions(tcAddress, tx, isUpdateTime);
    }
  };

  // sign transaction
  private getSignKey = (tcAddress: string) => {
    return `sign-transaction-${tcAddress.toLowerCase()}`;
  };
  getStoredSigns = (tcAddress: string): IStoredSign => {
    const key = this.getSignKey(tcAddress);
    return (localStorage.get(key) || {}) as IStoredSign;
  };
  setStoredSign = (tcAddress: string, signData: IStoredSignValue) => {
    if (!tcAddress || !signData) return;
    const signs = this.getStoredSigns(tcAddress);
    if (signs[signData.hash] || signs[signData.hash.toLowerCase()]) return;
    const key = this.getSignKey(tcAddress);
    localStorage.set(key, {
      ...signs,
      [signData.hash]: {
        ...signData,
        time: new Date().getTime(),
      },
    });
  };
  updateSpeedUpBTCHash = (newBTCHash: string, oldBTCHash: string, tcAddress: string) => {
    const key = this.getTxsKey(tcAddress);
    const txs = (localStorage.get(key) || []) as ITCTxDetail[];
    const newTxs = txs.map(tx => {
      if (tx.btcHash && tx.btcHash.toLowerCase() === oldBTCHash.toLowerCase()) {
        return {
          ...tx,
          btcHash: newBTCHash,
          statusCode: 1,
        };
      }
      return tx;
    });
    localStorage.set(key, newTxs);
  };
}

const instance = new BitCoinStorage();

export default instance;
