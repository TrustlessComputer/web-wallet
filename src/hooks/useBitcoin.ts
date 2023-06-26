import { ConnectionType, getConnection } from '@/connection';
import { AssetsContext } from '@/contexts/assets-context';
import { generateBitcoinTaprootKey } from '@/utils/derive-key';
import { useWeb3React } from '@web3-react/core';
import { useContext } from 'react';
import * as TC_SDK from 'trustless-computer-sdk';
import BigNumber from 'bignumber.js';
import { Buffer } from 'buffer';
import { useCurrentUser } from '@/state/user/hooks';
import bitcoinStorage from '@/utils/bitcoin-storage';
import { ITCTxDetail } from '@/interfaces/transaction';

export interface ISendBTCProps {
  receiver: string;
  feeRate: number;
  amount: string;
}

export interface ISignKeyResp {
  privateKey: Buffer;
  walletAddressBtcTaproot: string;
  evmAddress: string;
}

export interface ICreateInscribeParams {
  tcTxIDs: Array<string>;
  feeRatePerByte: number;
}
export interface ICreateBatchInscribeParams {
  tcTxDetails: any;
  feeRatePerByte: number;
}

export interface ICreateInscribeResponse {
  commitTxHex: string;
  commitTxID: string;
  revealTxHex: string;
  revealTxID: string;
  totalFee: BigNumber;
}

export interface ICreateSpeedUpBTCParams {
  btcHash: string;
  feeRate: number;
  tcAddress: string;
  btcAddress: string;
}

export interface IIsSpeedUpBTCParams {
  btcHash: string;
  tcAddress: string;
  btcAddress: string;
}

const useBitcoin = () => {
  const user = useCurrentUser();
  const { getAvailableAssetsCreateTx } = useContext(AssetsContext);
  const { account: evmAddress, connector } = useWeb3React();

  const signKey = async (): Promise<ISignKeyResp> => {
    const connection = getConnection(connector);
    if (connection?.type === ConnectionType.METAMASK) {
      const error = 'Can not sign with metamask';
      const walletAddressBtcTaproot = user?.walletAddressBtcTaproot;
      if (!evmAddress || !walletAddressBtcTaproot) throw new Error(error);
      const { taprootChild } = await generateBitcoinTaprootKey(evmAddress);
      const privateKey = taprootChild.privateKey;
      if (!privateKey) throw new Error(error);
      return {
        privateKey,
        walletAddressBtcTaproot,
        evmAddress,
      };
    }

    return {
      privateKey: Buffer.from(''),
      walletAddressBtcTaproot: '',
      evmAddress: '',
    };
  };

  const createInscribeTx = async ({ tcTxIDs, feeRatePerByte }: ICreateInscribeParams) => {
    const assets = await getAvailableAssetsCreateTx();
    if (!assets) throw new Error('Can not load assets');
    const { privateKey, walletAddressBtcTaproot } = await signKey();
    const { commitTxHex, commitTxID, revealTxHex, revealTxID } = await TC_SDK.createInscribeTx({
      senderPrivateKey: privateKey,
      utxos: assets.availableUTXOs,
      senderAddress: walletAddressBtcTaproot,

      inscriptions: {},
      tcTxIDs,
      feeRatePerByte,
    });

    return { commitTxHex, commitTxID, revealTxHex, revealTxID };
  };

  const createBatchInscribeTxs = async ({ tcTxDetails, feeRatePerByte }: ICreateBatchInscribeParams) => {
    const assets = await getAvailableAssetsCreateTx();
    if (!assets) throw new Error('Can not load assets');
    const { privateKey, walletAddressBtcTaproot } = await signKey();

    const res = await TC_SDK.createBatchInscribeTxs({
      senderPrivateKey: privateKey,
      senderAddress: walletAddressBtcTaproot,
      utxos: assets.availableUTXOs,
      inscriptions: {},
      tcTxDetails,
      feeRatePerByte,
    });

    return res;
  };

  const getNonceInscribeable = async (
    tcAddress: string,
  ): Promise<{
    nonce: number;
  }> => {
    if (!tcAddress) throw Error('Address not found');
    const nonce = await window.tcClient.getInscribeableNonce(tcAddress);
    return { nonce };
  };

  const getUnInscribedTransactionByAddress = async (tcAddress: string): Promise<Array<string>> => {
    if (!tcAddress) throw Error('Address not found');
    const { unInscribedTxIDs } = await window.tcClient.getUnInscribedTransactionByAddress(tcAddress);
    return unInscribedTxIDs;
  };

  const getTCTransactionByHex = async (tcTxID: string): Promise<string> => {
    if (!tcTxID) throw Error('Address not found');
    const { Hex } = (await window.tcClient.getTCTxByHash(tcTxID)) as any;
    return Hex;
  };

  const getPendingInscribeTxsDetail = async (tcAddress: string): Promise<any[]> => {
    if (!tcAddress) throw Error('Address not found');
    try {
      const pendingTxs = (await window.tcClient.getPendingInscribeTxsDetail(tcAddress)) || [];
      const transactions = pendingTxs.map(tx => {
        const { TCHash, Reveal } = tx;
        const btcHash = Reveal.BTCHash;
        return {
          Hash: TCHash,
          btcHash,
          statusCode: 1,
        };
      });
      return transactions;
    } catch (e) {
      return [];
    }
  };

  const getUnInscribedTransactionDetailByAddress = async (tcAddress: string): Promise<ITCTxDetail[]> => {
    if (!tcAddress) throw Error('Address not found');
    const { unInscribedTxDetails } = await window.tcClient.getUnInscribedTransactionDetailByAddress(tcAddress);

    const uninscribes: ITCTxDetail[] = [];
    for (const uninscribe of unInscribedTxDetails) {
      try {
        await getTCTransactionByHex(uninscribe.Hash);
        uninscribes.push(uninscribe);
      } catch (e) {
        // todo handle error
      }
    }

    const storageTxs = bitcoinStorage.getStorageTransactions(tcAddress);

    return uninscribes.map(tx => {
      const storageTx = storageTxs.find(item => item.Hash.toLowerCase() === tx.Hash.toLowerCase());
      if (!storageTx) return { ...tx, statusCode: 0 };
      return {
        ...storageTx,
        ...tx,
        statusCode: 0,
      };
    });
  };

  const sendBTC = async ({ receiver, amount, feeRate }: ISendBTCProps) => {
    const assets = await getAvailableAssetsCreateTx();
    if (!assets) throw new Error('Can not load assets');
    const { privateKey, walletAddressBtcTaproot } = await signKey();

    const { txHex } = await TC_SDK.createTx({
      feeRatePerByte: feeRate,
      inscriptions: {},
      receiverInsAddress: receiver,
      sendInscriptionID: '',
      sendAmount: new BigNumber(amount).multipliedBy(1e8),
      senderAddress: walletAddressBtcTaproot,
      senderPrivateKey: privateKey,
      utxos: assets.availableUTXOs,
    });

    // broadcast tx
    await TC_SDK.broadcastTx(txHex);
  };

  const createSpeedUpBTCTx = async (payload: ICreateSpeedUpBTCParams): Promise<string> => {
    const assets = await getAvailableAssetsCreateTx();
    if (!assets) throw new Error('Can not load assets');
    const { privateKey } = await signKey();
    const { revealTxID } = await TC_SDK.replaceByFeeInscribeTx({
      senderPrivateKey: privateKey,
      utxos: assets.availableUTXOs,
      inscriptions: {},
      revealTxID: payload.btcHash,
      feeRatePerByte: payload.feeRate,
      tcAddress: payload.tcAddress,
      btcAddress: payload.btcAddress,
    });
    return revealTxID;
  };

  const isRBFable = async (payload: IIsSpeedUpBTCParams) => {
    try {
      const { isRBFable, oldFeeRate, minSat } = await TC_SDK.isRBFable({
        revealTxID: payload.btcHash,
        tcAddress: payload.tcAddress,
        btcAddress: payload.btcAddress,
      });
      return {
        isRBFable,
        oldFeeRate: Math.ceil(oldFeeRate),
        minSat: Math.ceil(minSat || 0),
      };
    } catch (e) {
      return {
        isRBFable: false,
        oldFeeRate: 0,
        minSat: 0,
      };
    }
  };

  return {
    createInscribeTx,
    createBatchInscribeTxs,
    signKey,
    getNonceInscribeable,
    getUnInscribedTransactionByAddress,
    getUnInscribedTransactionDetailByAddress,
    getTCTransactionByHex,
    createSpeedUpBTCTx,
    sendBTC,
    isRBFable,
    getPendingInscribeTxsDetail,
  };
};

export default useBitcoin;
