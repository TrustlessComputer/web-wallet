import { getUserSelector } from '@/state/user/selector';
import { useSelector } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import { SupportedChainId } from '@/constants/chains';

const useCurrentUser = () => {
  const { account, chainId } = useWeb3React();
  const user = useSelector(getUserSelector);
  const accountState = user?.account;
  if (
    !accountState ||
    !account ||
    !accountState[account.toLowerCase()] ||
    chainId !== SupportedChainId.TRUSTLESS_COMPUTER
  ) {
    return undefined;
  }

  return accountState[account.toLowerCase()];
};

export { useCurrentUser };
