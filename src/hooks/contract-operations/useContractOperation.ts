import { SupportedChainId } from '@/constants/chains';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { capitalizeFirstLetter, switchChain } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { useContext } from 'react';
import useBitcoin from '../useBitcoin';
import { AssetsContext } from '@/contexts/assets-context';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/constants/route-path';
import { useCurrentUser } from '@/state/user/hooks';
import bitcoinStorage from '@/utils/bitcoin-storage';
import BigNumber from 'bignumber.js';

interface IParams<P, R> {
  operation: ContractOperationHook<P, R>;
  inscribeable?: boolean;
  chainId?: SupportedChainId;
}

interface IContractOperationReturn<P, R> {
  run: (p: P) => Promise<R>;
}

const useContractOperation = <P, R>(args: IParams<P, R>): IContractOperationReturn<P, R> => {
  const { operation, chainId = SupportedChainId.TRUSTLESS_COMPUTER, inscribeable = true } = args;
  const { call, dAppType, transactionType } = operation();
  const { feeRate, getAvailableAssetsCreateTx } = useContext(AssetsContext);
  const { chainId: walletChainId } = useWeb3React();
  const user = useCurrentUser();
  const { createInscribeTx, getUnInscribedTransactionByAddress } = useBitcoin();
  const navigate = useNavigate();

  const checkAndSwitchChainIfNecessary = async (): Promise<void> => {
    console.log('walletChainId', walletChainId);
    console.log('chainId', chainId);

    if (walletChainId !== chainId) {
      await switchChain(chainId);
    }
  };

  const run = async (params: P): Promise<R> => {
    try {
      // This function does not handle error
      // It delegates error to caller

      if (!user?.walletAddress) {
        navigate(`${ROUTE_PATH.HOME}?next=${window.location.href}`);
        throw Error('Please connect wallet to continue.');
      }

      // Check & switch network if necessary
      await checkAndSwitchChainIfNecessary();
      console.time('____assetsLoadTime');
      const assets = await getAvailableAssetsCreateTx();
      console.timeEnd('____assetsLoadTime');
      console.log('assets', assets);
      if (!assets) {
        throw Error('Can not get assets. Please try again.');
      }

      if (!inscribeable) {
        // Make TC transaction
        console.time('____metamaskCreateTxTime');
        const tx: R = await call({
          ...params,
        });
        console.timeEnd('____metamaskCreateTxTime');

        console.log('tcTX', tx);
        return tx;
      }

      // Check unInscribed transactions
      console.time('____unInscribedTxIDsLoadTime');
      const unInscribedTxIDs = await getUnInscribedTransactionByAddress(user.walletAddress);
      console.timeEnd('____unInscribedTxIDsLoadTime');

      if (unInscribedTxIDs.length > 0) {
        throw Error('You have some pending transactions. Please complete all of them before moving on.');
      }

      console.log('unInscribedTxIDs', unInscribedTxIDs);

      console.time('____metamaskCreateTxTime');
      const tx: R = await call({
        ...params,
      });
      console.timeEnd('____metamaskCreateTxTime');

      console.log('tcTX', tx);

      console.log('feeRatePerByte', feeRate.fastestFee);

      // Make inscribe transaction
      const { revealTxID } = await createInscribeTx({
        tcTxIDs: [...unInscribedTxIDs, Object(tx).hash],
        feeRatePerByte: feeRate.fastestFee,
      });

      if (dAppType === DAppType.BNS || dAppType === DAppType.ERC721 || dAppType === DAppType.ERC20) {
        bitcoinStorage.addStorageTransactions(user.walletAddress, {
          From: user?.walletAddress,
          Gas: 0,
          GasPrice: 0,
          Hash: Object(tx).hash,
          Input: undefined,
          Nonce: 0,
          R: new BigNumber(0),
          S: new BigNumber(0),
          To: '',
          Type: 0,
          V: 0,
          Value: 0,
          btcHash: revealTxID,
          statusCode: 1,
          method: `${transactionType} ${dAppType}`,
        });
      }

      // const currentTimeString = moment().format('YYYY-MM-DDTHH:mm:ssZ');
      // const transactionHistory: ICreateTransactionPayload = {
      //   dapp_type: `${TransactionEventType.CREATE} ${dAppType}`,
      //   tx_hash: Object(tx).hash,
      //   from_address: Object(tx).from,
      //   to_address: Object(tx).to,
      //   time: currentTimeString,
      // };
      // if (commitTxID && revealTxID) {
      //   transactionHistory.btc_tx_hash = revealTxID;
      // }
      // await createTransactionHistory(transactionHistory);

      return tx;
    } catch (err) {
      if (Object(err).reason) {
        throw Error(capitalizeFirstLetter(Object(err).reason));
      }
      throw err;
    }
  };

  return {
    run,
  };
};

export default useContractOperation;
