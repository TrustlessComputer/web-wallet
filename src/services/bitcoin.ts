// import { apiClient } from '@/services';
import {
  BINANCE_PAIR,
  FeeRateName,
  IBlockStreamTxs,
  ICollectedUTXOResp,
  IFeeRate,
  IPendingUTXO,
} from '@/interfaces/api/bitcoin';
import * as TC_SDK from 'trustless-computer-sdk';
import { API_BLOCKSTREAM } from '@/configs';

// Collected UTXO
export const getCollectedUTXO = async (
  btcAddress: string,
  tcAddress: string,
): Promise<ICollectedUTXOResp | undefined> => {
  try {
    try {
      const utxos = TC_SDK.getUTXOs({
        btcAddress: btcAddress,
        tcAddress: tcAddress,
      });
      return utxos;
    } catch (e) {
      return undefined;
    }
  } catch (err) {
    console.log(err);
  }
};

export const getPendingUTXOs = async (btcAddress: string): Promise<IPendingUTXO[]> => {
  let pendingUTXOs = [];
  if (!btcAddress) return [];
  try {
    const res = await fetch(`${API_BLOCKSTREAM}/address/${btcAddress}/txs`).then(res => {
      return res.json();
    });
    pendingUTXOs = (res || []).filter((item: IPendingUTXO) => !item.status.confirmed);
  } catch (err) {
    return [];
  }
  return pendingUTXOs;
};

export const getBlockstreamTxs = async (btcAddress: string): Promise<IBlockStreamTxs[]> => {
  let txs = [];
  if (!btcAddress) return [];
  try {
    const res = await fetch(`${API_BLOCKSTREAM}/address/${btcAddress}/txs`).then(res => {
      return res.json();
    });
    txs = res;
  } catch (err) {
    return [];
  }
  return txs;
};

export const getFeeRate = async (): Promise<IFeeRate> => {
  try {
    const res = await fetch('https://mempool.space/api/v1/fees/recommended');
    const fee: IFeeRate = await res.json();
    return fee;
  } catch (err: unknown) {
    console.log(err);
    return {
      [FeeRateName.fastestFee]: 25,
      [FeeRateName.halfHourFee]: 20,
      [FeeRateName.hourFee]: 15,
    };
  }
};

// eslint-disable-next-line no-unused-vars
export const getTokenRate = async (_: BINANCE_PAIR = 'ETHBTC'): Promise<number> => {
  return 1;
  // try {
  //   // const res = await fetch(`${BINANCE_API_URL}/ticker/price?symbol=${pair}`);
  //   // const data: ITokenPriceResp = await res.json();
  //   // const rate = data?.price;
  //   // return new BigNumber(rate).toNumber();
  //   return 1;
  // } catch (err: unknown) {
  //   console.log(err);
  //   throw err;
  // }
};
