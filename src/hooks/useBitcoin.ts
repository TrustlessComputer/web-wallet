import { TC_NETWORK_RPC } from '@/configs';
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
import { BTC_NETWORK } from '@/utils/commons';

export interface ISendInsProps {
  receiverAddress: string;
  feeRate: number;
  inscriptionNumber: number;
}

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

export interface IInscriptionByOutput {
  [key: string]: TC_SDK.Inscription[];
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
  const tcClient = new TC_SDK.TcClient(BTC_NETWORK, TC_NETWORK_RPC);
  console.log('tcClient: ', tcClient);
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
    const { privateKey } = await signKey();

    console.log('inside createInscribeTx', {
      senderPrivateKey: privateKey,
      utxos: assets.txrefs,
      inscriptions: {},
      tcTxIDs,
      feeRatePerByte,
      tcClient,
    });

    const { commitTxHex, commitTxID, revealTxHex, revealTxID } = await TC_SDK.createInscribeTx({
      senderPrivateKey: privateKey,
      utxos: assets.txrefs,
      inscriptions: {},
      tcTxIDs,
      feeRatePerByte,
      tcClient,
    });

    console.log('commitTxID', commitTxID);
    console.log('commitTxHex', commitTxHex);
    console.log('revealTxID', revealTxID);
    console.log('revealTxHex', revealTxHex);

    return { commitTxHex, commitTxID, revealTxHex, revealTxID };
  };

  const createBatchInscribeTxs = async ({ tcTxDetails, feeRatePerByte }: ICreateBatchInscribeParams) => {
    const assets = await getAvailableAssetsCreateTx();
    if (!assets) throw new Error('Can not load assets');
    const { privateKey } = await signKey();

    console.log('inside createBatchInscribeTxs', {
      senderPrivateKey: privateKey,
      utxos: assets.txrefs,
      inscriptions: {},
      tcTxDetails,
      feeRatePerByte,
      tcClient,
    });

    // tcTxIDs: string[];
    // commitTxHex: string;
    // commitTxID: string;
    // revealTxHex: string;
    // revealTxID: string;
    // totalFee: BigNumber;

    const res = await TC_SDK.createBatchInscribeTxs({
      senderPrivateKey: privateKey,
      utxos: assets.txrefs,
      inscriptions: {},
      tcTxDetails,
      feeRatePerByte,
      tcClient,
    });

    // console.log('commitTxID', commitTxID);
    // console.log('commitTxHex', commitTxHex);
    // console.log('revealTxID', revealTxID);
    // console.log('revealTxHex', revealTxHex);

    return res;
  };

  const getNonceInscribeable = async (
    tcAddress: string,
  ): Promise<{
    nonce: number;
    gasPrice: number;
  }> => {
    if (!tcAddress) throw Error('Address not found');
    const { nonce, gasPrice } = await tcClient.getNonceInscribeable(tcAddress);
    return { nonce, gasPrice };
  };

  const getUnInscribedTransactionByAddress = async (tcAddress: string): Promise<Array<string>> => {
    if (!tcAddress) throw Error('Address not found');
    const { unInscribedTxIDs } = await tcClient.getUnInscribedTransactionByAddress(tcAddress);
    return unInscribedTxIDs;
  };

  const getUnInscribedTransactionDetailByAddress = async (tcAddress: string): Promise<ITCTxDetail[]> => {
    if (!tcAddress) throw Error('Address not found');
    const { unInscribedTxDetails } = await tcClient.getUnInscribedTransactionDetailByAddress(tcAddress);
    const storageTxs = bitcoinStorage.getStorageTransactions(tcAddress);

    return unInscribedTxDetails.map(tx => {
      const storageTx = storageTxs.find(item => item.Hash.toLowerCase() === tx.Hash.toLowerCase());
      if (!storageTx) return { ...tx, statusCode: 0 };
      return {
        ...storageTx,
        ...tx,
        statusCode: 0,
      };
    });
  };

  const getTCTransactionByHash = async (tcTxID: string): Promise<string> => {
    if (!tcTxID) throw Error('Address not found');
    const { Hex } = (await tcClient.getTCTxByHash(tcTxID)) as any;
    return Hex;
  };

  const formatUTXOs = (txrefs: TC_SDK.UTXO[]) => {
    const utxos: TC_SDK.UTXO[] = (txrefs || []).map(utxo => ({
      tx_hash: utxo.tx_hash,
      tx_output_n: new BigNumber(utxo.tx_output_n).toNumber(),
      value: new BigNumber(utxo.value),
    }));
    return utxos;
  };
  const formatInscriptions = (inscriptions: IInscriptionByOutput) => {
    const _inscriptions: IInscriptionByOutput = {};
    Object.keys(inscriptions).forEach(key => {
      const utxos = inscriptions[key];
      if (!!utxos && !!utxos.length) {
        _inscriptions[key] = utxos?.map(utxo => ({
          ...utxo,
          offset: new BigNumber(utxo.offset),
        }));
      }
    });
    return _inscriptions;
  };

  const sendBTC = async ({ receiver, amount, feeRate }: ISendBTCProps) => {
    const assets = await getAvailableAssetsCreateTx();
    if (!assets) throw new Error('Can not load assets');
    const { privateKey } = await signKey();

    const utxos = formatUTXOs(assets.txrefs);
    const inscriptions = formatInscriptions(assets.inscriptions_by_outputs);

    const { txHex } = await TC_SDK.createTx(
      privateKey,
      utxos,
      inscriptions,
      '',
      receiver,
      new BigNumber(amount).multipliedBy(1e8),
      feeRate,
      true,
    );

    // broadcast tx
    await TC_SDK.broadcastTx(txHex);
  };

  const createSpeedUpBTCTx = async (payload: ICreateSpeedUpBTCParams): Promise<string> => {
    const assets = await getAvailableAssetsCreateTx();
    if (!assets) throw new Error('Can not load assets');
    const { privateKey } = await signKey();
    const { revealTxID } = await TC_SDK.replaceByFeeInscribeTx({
      senderPrivateKey: privateKey,
      utxos: assets.txrefs,
      inscriptions: assets.inscriptions_by_outputs,
      revealTxID: payload.btcHash,
      feeRatePerByte: payload.feeRate,
      tcClient,
      tcAddress: payload.tcAddress,
      btcAddress: payload.btcAddress,
    });
    return revealTxID;
  };

  const isRBFable = async (payload: IIsSpeedUpBTCParams) => {
    const { isRBFable, oldFeeRate } = await TC_SDK.isRBFable({
      revealTxID: payload.btcHash,
      tcClient,
      tcAddress: payload.tcAddress,
      btcAddress: payload.btcAddress,
    });
    return {
      isRBFable,
      oldFeeRate,
    };
  };

  return {
    createInscribeTx,
    createBatchInscribeTxs,
    signKey,
    getNonceInscribeable,
    getUnInscribedTransactionByAddress,
    getUnInscribedTransactionDetailByAddress,
    getTCTransactionByHash,
    createSpeedUpBTCTx,
    sendBTC,
    isRBFable,
  };
};

export default useBitcoin;
