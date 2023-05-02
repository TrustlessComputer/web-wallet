import createAxiosInstance from './http-client';

const bridgeClient = createAxiosInstance({ baseURL: 'https://api.trustlessbridge.io' });

const API_PATH = '/api/trigger-hash';

export const triggerHash = async (hash: string, address: string) => {
  try {
    const response = await bridgeClient.post(`${API_PATH}`, {
      hash,
      address,
    });
    console.log('[triggerHash] response: ', response);
  } catch (error: any) {
    console.log('[triggerHash] error: ', error);
  }
};
