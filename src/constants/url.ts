import { isProduction } from '@/utils/commons';

export const XVERSE_DOWNLOAD_URL = 'https://www.xverse.app/download';
export const TC_EXPLORER = isProduction()
  ? 'https://explorer.trustless.computer'
  : 'https://explorer.regtest.trustless.computer';
