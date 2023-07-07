const ENVS = import.meta.env;

// App configs
export const APP_ENV: string = ENVS.VITE_MODE;
export const API_URL: string = ENVS.VITE_API_URL;
export const TC_NETWORK_RPC: string = ENVS.VITE_TC_NETWORK_RPC;
export const CDN_URL: string = ENVS.VITE_CDN_URL;
export const API_FAUCET: string = ENVS.VITE_API_FAUCET;
export const API_BLOCKSTREAM: string = ENVS.VITE_BLOCKSTREAM;

export const CDN_URL_ICONS: string = CDN_URL + '/wallet-icons';

// Contract configs
export const ARTIFACT_CONTRACT: string = ENVS.VITE_ARTIFACT_CONTRACT;
export const BNS_CONTRACT: string = ENVS.VITE_BNS_CONTRACT;
export const BFS_ADDRESS: string = ENVS.VITE_BFS_CONTRACT;
export const SOULS_CONTRACT: string = '0xab566c459f0e8067c842e4c74bd47e7a7ca8fb2d';

export const TC_URL: string = ENVS.VITE_TC_URL;
export const TRANSFER_TX_SIZE = 1000;
