import { TAPROOT_ADDRESS } from '@/constants/storage-key';
import localStorage from '@/utils/localstorage';
import { ITCTxDetail } from '@/interfaces/transaction';

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
    return localStorage.get(key) || [];
  };
  addStorageTransactions = (tcAddress: string, tx: ITCTxDetail) => {
    const key = this.getTxsKey(tcAddress);
    const txs = this.getStorageTransactions(tcAddress);
    txs?.push(tx);
    localStorage.set(key, txs);
  };
}

const instance = new BitCoinStorage();

export default instance;
