import { APP_ENV } from '@/configs';
import { ApplicationEnvironment } from '@/enums/configs';
import * as TC_SDK from 'trustless-computer-sdk';

export const isProduction = (): boolean => {
  return APP_ENV === ApplicationEnvironment.PRODUCTION;
};

export const isDevelop = (): boolean => {
  return APP_ENV === ApplicationEnvironment.DEVELOP;
};

export const BTC_NETWORK = isProduction() ? TC_SDK.Mainnet : TC_SDK.Regtest;
