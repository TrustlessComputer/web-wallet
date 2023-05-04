import { ACCESS_TOKEN, REFRESH_TOKEN, WALLET_ADDRESS } from '@/constants/storage-key';
import localStorage from '@/utils/localstorage';
// import { User } from '@interfaces/user';
// import { isBrowser } from '@utils/common';
// import { walletBTCStorage } from '@/bitcoin/utils/storage';

// export const clearAccessTokenStorage = (): void => {
//   localStorage.remove(ACCESS_TOKEN);
//   localStorage.remove(REFRESH_TOKEN);
// };

export const getAccessToken = (): string | null => {
  const accessToken = localStorage.get(ACCESS_TOKEN) as string;
  return accessToken;
};

export const clearAccessTokenStorage = (): void => {
  localStorage.remove(ACCESS_TOKEN);
  localStorage.remove(REFRESH_TOKEN);
};

export const clearAuthStorage = (): void => {
  localStorage.remove(ACCESS_TOKEN);
  localStorage.remove(REFRESH_TOKEN);
};

export const setAccessToken = (accessToken: string, refreshToken: string): void => {
  localStorage.set(ACCESS_TOKEN, accessToken);
  localStorage.set(REFRESH_TOKEN, refreshToken);
};

export const setLastedWalletAddress = (address: string): void => {
  localStorage.set(WALLET_ADDRESS, address);
};

export const getLastedWalletAddress = (): string | null => {
  return localStorage.get(WALLET_ADDRESS) as string;
};
