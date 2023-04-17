import { createSlice } from '@reduxjs/toolkit';
import { ConnectionType } from '@/connection';

interface IAccount {
  [key: string]: {
    walletAddressBtcTaproot: string;
    walletAddress: string;
  };
}
export interface UserState {
  selectedWallet?: ConnectionType;
  walletAddressBtcTaproot?: string;
  walletAddress?: string;
  account?: IAccount;
}
export const initialState: UserState = {
  selectedWallet: undefined,
  walletAddressBtcTaproot: undefined,
  walletAddress: undefined,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateSelectedWallet(state, { payload: { wallet } }) {
      state.selectedWallet = wallet;
    },
    resetUser(state) {
      state.selectedWallet = undefined;
      state.account = undefined;
    },
    updateUser(state, { payload: { tpAddress, tcAddress } }) {
      const address = tcAddress.toLowerCase();
      const account = {
        ...(state.account || {}),
        [address]: {
          walletAddress: address,
          walletAddressBtcTaproot: tpAddress,
        },
      };
      state.account = { ...account };
    },
  },
});

export const { updateSelectedWallet, resetUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
