import * as TC_SDK from 'trustless-computer-sdk';
import { TC_NETWORK_RPC } from '@/configs';
import { isProduction } from '@/utils/commons';

enum NetworkNumber {
  mainnet = 1,
  testnet,
  regtest,
}

const SDKConfigs = () => {
  const networkNumber = isProduction() ? NetworkNumber.mainnet : NetworkNumber.regtest;
  const networkBTC = isProduction() ? TC_SDK.Mainnet : TC_SDK.Regtest;

  TC_SDK.setBTCNetwork(networkNumber);

  // setup storage
  const storage = new TC_SDK.StorageService();
  storage.implement({
    namespace: undefined,
    async getMethod(key: string): Promise<string | null> {
      return localStorage.getItem(key);
    },
    async removeMethod(key: string) {
      await localStorage.removeItem(key);
    },
    async setMethod(key: string, data: string) {
      return localStorage.setItem(key, data);
    },
  });

  const tcClient = new TC_SDK.TcClient(networkBTC, TC_NETWORK_RPC);

  TC_SDK.setupConfig({
    storage,
    tcClient,
    netType: networkNumber,
  });
};

export default SDKConfigs;
