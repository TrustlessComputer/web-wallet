import { TC_NETWORK_RPC } from '@/configs';
import { isProduction } from '@/utils/commons';

export enum SupportedChainId {
  TRUSTLESS_COMPUTER = isProduction() ? 22213 : 22215,
}

export const TRUSTLESS_COMPUTER_CHAIN_INFO = {
  name: 'Trustless Computer',
  title: '',
  chain: 'TC',
  icon: '',
  rpc: [TC_NETWORK_RPC],
  faucets: [],
  nativeCurrency: {
    name: 'JUICE',
    symbol: 'TC',
    decimals: 18,
  },
  infoURL: 'https://trustless.computer',
  shortName: 'TC',
  chainId: SupportedChainId.TRUSTLESS_COMPUTER,
  networkId: SupportedChainId.TRUSTLESS_COMPUTER,
  slip44: 0,
  explorers: [
    {
      name: 'Trustless computer explorer',
      url: 'https://explorer.trustless.computer',
      standard: 'EIP3091',
    },
  ],
  ens: {
    registry: '',
  },
};
