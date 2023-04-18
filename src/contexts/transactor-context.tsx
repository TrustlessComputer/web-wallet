import React, { PropsWithChildren, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface ITransactorContext {}

const initialValue: ITransactorContext = {};

export const TransactorContext = React.createContext<ITransactorContext>(initialValue);

export const TransactorProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const [searchParams] = useSearchParams();

  console.log('SANG TEST: ', searchParams);

  const contextValues = useMemo((): ITransactorContext => {
    return {};
  }, []);

  return <TransactorContext.Provider value={contextValues}>{children}</TransactorContext.Provider>;
};
