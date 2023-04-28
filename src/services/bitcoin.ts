import { apiClient } from '@/services';
import { BINANCE_PAIR, FeeRateName, ICollectedUTXOResp, IFeeRate, IPendingUTXO } from '@/interfaces/api/bitcoin';
import BigNumber from 'bignumber.js';
import * as TC_SDK from 'trustless-computer-sdk';
import { API_BLOCKSTREAM, TC_NETWORK_RPC } from '@/configs';
import { BTC_NETWORK } from '@/utils/commons';

// const BINANCE_API_URL = 'https://api.binance.com/api/v3';
const WALLETS_API_PATH = '/wallets';

// Collected UTXO
export const getCollectedUTXO = async (
  btcAddress: string,
  tcAddress: string,
): Promise<ICollectedUTXOResp | undefined> => {
  try {
    const collected: any = await apiClient.get<ICollectedUTXOResp>(`${WALLETS_API_PATH}/${btcAddress}`);
    const incomingUTXOs: TC_SDK.UTXO[] = [];
    const pendingUTXOs = await getPendingUTXOs(btcAddress);
    for (const utxo of pendingUTXOs) {
      for (let index = 0; index < utxo.vout.length; index++) {
        const vout = utxo.vout[index];
        if (vout.scriptpubkey_address.toLowerCase() === btcAddress.toLowerCase() && vout.value) {
          // append incoming utxo
          incomingUTXOs.push({
            tx_hash: utxo.txid,
            tx_output_n: index,
            value: new BigNumber(vout.value),
          });
        }
      }
    }
    const tempUTXOs = [...(collected?.txrefs || []), ...incomingUTXOs];
    let utxos;
    try {
      const tcClient = new TC_SDK.TcClient(BTC_NETWORK, TC_NETWORK_RPC);
      utxos = await TC_SDK.aggregateUTXOs({
        tcAddress: tcAddress,
        btcAddress: btcAddress,
        utxos: [...tempUTXOs],
        tcClient,
      });
    } catch (e) {
      utxos = [...tempUTXOs];
    }
    return {
      ...collected,
      txrefs: utxos || [],
    } as any;
  } catch (err) {
    console.log(err);
  }
};

export const getPendingUTXOs = async (btcAddress: string): Promise<IPendingUTXO[]> => {
  let pendingUTXOs = [];
  if (!btcAddress) return [];
  try {
    // https://blockstream.regtest.trustless.computer/regtest/api/address/bcrt1p7vs2w9cyeqpc7ktzuqnm9qxmtng5cethgh66ykjz9uhdaz0arpfq93cr3a/txs
    const res = await fetch(`${API_BLOCKSTREAM}/address/${btcAddress}/txs`).then(res => {
      return res.json();
    });
    pendingUTXOs = (res || []).filter((item: IPendingUTXO) => !item.status.confirmed);
  } catch (err) {
    return [];
  }
  return pendingUTXOs;
};

export const getFeeRate = async (): Promise<IFeeRate> => {
  try {
    const res = await fetch('https://mempool.space/api/v1/fees/recommended');
    const fee: IFeeRate = await res.json();
    if (fee[FeeRateName.fastestFee] <= 10) {
      return {
        [FeeRateName.fastestFee]: 15,
        [FeeRateName.halfHourFee]: 10,
        [FeeRateName.hourFee]: 5,
      };
    }
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
