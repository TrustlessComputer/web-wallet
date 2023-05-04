import createAxiosInstance from './http-client';

const tcNodeClient = createAxiosInstance({ baseURL: 'https://tc-node.trustless.computer' });

const API_PATH = '/proxy/ping';

export const triggerSwitchAccount = async (walletAddress: string) => {
  try {
    const response = await tcNodeClient.get(
      `${API_PATH}?origin=https://trustlesswallet.io/&walletAddress=${walletAddress}`,
    );
    console.log('[triggerSwitchAccount] response: ', response);
  } catch (error: any) {
    console.log('[triggerSwitchAccount] error: ', error);
  }
};
