import { isAddress } from '@ethersproject/address';

export const formatAddress = (address?: string, length = 10): string => {
  if (!address) return '';
  if (address.length < 14) return address;
  return `${address.substring(0, length)}`;
};

export const formatLongAddress = (address?: string): string => {
  if (!address) return '';
  if (address.length < 14) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4, address.length)}`;
};

export function shortenAddress(address: string, charsStart = 4, charsEnd?: number): string {
  const parsed = isAddress(address);
  if (!parsed) return '';

  return `${address.substring(0, charsStart + 2)}...${address.substring(42 - (charsEnd || charsStart))}`;
}

export const ellipsisCenter = (payload: { str: string; limit?: number; dots?: string }) => {
  const { str, limit = 6, dots = '...' } = payload;
  try {
    const size = str.length;
    if (size < limit * 2 + dots.length) {
      return str;
    }
    const leftStr = str.substring(0, limit);
    const rightStr = str.substring(size - limit, size);
    return leftStr + dots + rightStr;
  } catch {
    return str;
  }
};
