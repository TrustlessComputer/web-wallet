import React from 'react';
import routes from '@/routes/index';
import { useRoutes } from 'react-router-dom';
import Web3Provider from '@/components/Web3Provider';
import { Provider } from 'react-redux';
import store from '@/state';
import { WalletProvider } from '@/contexts/wallet-context';
import { XverseProvider } from '@/contexts/xverse-context';
import { AssetsProvider } from './contexts/assets-context';
import 'bootstrap/dist/css/bootstrap.min.css';
import ThemeProvider, { ThemedGlobalStyle } from '@/theme/theme';
import { Toaster } from 'react-hot-toast';
import './reset.scss';
import '@/styles/index.scss';
import { ConnectProvider } from '@/contexts/connect-context';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { TransactorProvider } from '@/contexts/transactor-context';

let persistor = persistStore(store);
const App: React.FC = (): React.ReactElement => {
  const element = useRoutes(routes);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <ThemedGlobalStyle />
          <Web3Provider>
            <XverseProvider>
              <WalletProvider>
                <ConnectProvider>
                  <AssetsProvider>
                    <TransactorProvider>{element}</TransactorProvider>
                  </AssetsProvider>
                  <Toaster position="top-center" reverseOrder={false} />
                </ConnectProvider>
              </WalletProvider>
            </XverseProvider>
          </Web3Provider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
