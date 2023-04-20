import { Transaction } from 'web3-eth';
import * as TC_SDK from 'trustless-computer-sdk';

export interface ICustomTransaction extends Transaction {
  Hex: string;
}

export interface ITransaction {
  createdAt: string;
  currency?: string;
  decimal?: number;
  deletedAt?: string;
  fromAddress: string;
  id: string;
  status: string;
  time?: string;
  toAddress: string;
  txHash: string;
  txHashType: string;
  updatedAt?: string;
  value: string;
  walletAddress: string;
  btcTxHash?: string;
}

export interface ICreateTransactionPayload {
  dapp_type: string;
  tx_hash: string;
  from_address?: string;
  to_address?: string;
  time?: string;
  value?: string;
  currency?: string;
  decimal?: number;
  btc_tx_hash?: string;
}

export interface IUpdateStatusTxPayload {
  tx_hash: string[];
  btc_hash?: string;
  status?: string;
}

export type IStatusCode = 0 | 1 | 2 | 3; // pending | processing | success | failed

export interface ITCTxDetail extends TC_SDK.TCTxDetail {
  time?: string;
  dappURL?: string;
  method?: string;
  btcHash?: string;
  statusCode?: IStatusCode;
}
