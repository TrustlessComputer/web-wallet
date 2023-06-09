import { TransactionResponse } from '@ethersproject/abstract-provider';
import { TransactionEventType } from '@/enums/transaction';

export enum DAppType {
  ERC721 = 'NFT', // NFTs
  ERC20 = 'Token', // Tokens
  BFS = 'Artifact', // Artifactx
  BNS = 'Name', // Name
}

export type ContractOperationHook<P, R> = (arg?: any) => {
  call: (args: P) => Promise<R>;
  dAppType: DAppType;
  transactionType: TransactionEventType;
};

export type DeployContractResponse = {
  hash: string;
  contractAddress: string;
  deployTransaction: TransactionResponse;
};
