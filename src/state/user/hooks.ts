import { getUserSelector } from '@/state/user/selector';
import { useSelector } from 'react-redux';

const useCurrentUser = () => {
  const user = useSelector(getUserSelector);
  if (!user || !user.walletAddress || !user.walletAddressBtcTaproot) return undefined;
  return user;
};

export { useCurrentUser };
