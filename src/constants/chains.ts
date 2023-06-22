import { TC_NETWORK_RPC } from '@/configs';
import { isProduction } from '@/utils/commons';
import { TC_EXPLORER } from '@/constants/url';

export enum SupportedChainId {
  TRUSTLESS_COMPUTER = isProduction() ? 22213 : 22215,
}

export const TRUSTLESS_COMPUTER_CHAIN_INFO = {
  name: isProduction() ? 'Trustless Computer' : 'Trustless Computer Regtest',
  title: '',
  chain: 'TC',
  icon: '',
  rpc: [TC_NETWORK_RPC],
  faucets: [],
  nativeCurrency: {
    name: 'TC',
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
      url: TC_EXPLORER,
      standard: 'EIP3091',
    },
  ],
  ens: {
    registry: '',
  },
};
