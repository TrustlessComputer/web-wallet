import { TAPROOT_ADDRESS } from '@/constants/storage-key';
import localStorage from '@/utils/localstorage';
import { ITCTxDetail } from '@/interfaces/transaction';
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
    return orderBy(txs, item => Number(item.time || 0), 'desc');
  };
  addStorageTransactions = (tcAddress: string, tx: ITCTxDetail) => {
    const key = this.getTxsKey(tcAddress);
    const txs = this.getStorageTransactions(tcAddress);
    const time = new Date().getTime();
    txs?.push({
      ...tx,
      time: `${time}`,
    });
    localStorage.set(key, txs);
  };
  updateStorageTransaction = (tcAddress: string, tx: ITCTxDetail) => {
    if (!tcAddress) return;
    const key = this.getTxsKey(tcAddress);
    const txs = this.getStorageTransactions(tcAddress);
    const index = txs.findIndex(p => p.Hash.toLowerCase() === tx.Hash.toLowerCase());
    if (index !== -1) {
      txs[index] = tx;
      localStorage.set(key, txs);
    } else {
      this.addStorageTransactions(tcAddress, tx);
    }
  };
}

const instance = new BitCoinStorage();

export default instance;
