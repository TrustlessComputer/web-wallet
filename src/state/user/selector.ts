import { UserState } from '@/state/user/reducer';
import { RootState } from '@/state';

export const getUserSelector = (state: RootState): UserState | undefined => state.user;

export const getIsAuthenticatedSelector = (state: RootState): boolean =>
  !!state.user.walletAddress && !!state.user.walletAddressBtcTaproot;
