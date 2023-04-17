import { getUserSelector } from '@/state/user/selector';
import { useSelector } from 'react-redux';
import { useWeb3React } from '@web3-react/core';

const useCurrentUser = () => {
  const { account } = useWeb3React();
  const user = useSelector(getUserSelector);
  const accountState = user?.account;
  if (!accountState || !account || !accountState[account.toLowerCase()]) return undefined;
  return accountState[account.toLowerCase()];
};

export { useCurrentUser };
