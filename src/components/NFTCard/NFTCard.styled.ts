import styled, { DefaultTheme } from 'styled-components';
import px2rem from '@/utils/px2rem';
import { Link } from 'react-router-dom';

export const Styled = styled(Link)`
  width: 100%;
  height: 100%;
  text-decoration: none !important;
  --bs-card-bg: none;

  border: 1px solid ${({ theme }: { theme: DefaultTheme }) => theme['border-primary']};
  border-radius: ${px2rem(8)};

  :hover {
    border: 1px solid ${({ theme }: { theme: DefaultTheme }) => theme['text-primary']};
  }

  .card-content {
  }

  .card-image {
    background: ${({ theme }: { theme: DefaultTheme }) => theme.black};
    min-height: ${px2rem(180)};
    padding: ${px2rem(32)};
    position: relative;
    border-top-left-radius: ${px2rem(8)};
    border-top-right-radius: ${px2rem(8)};

    .image {
      width: 100%;
      min-height: ${px2rem(100)};
      aspect-ratio: 1 / 1;
      height: auto;
      object-fit: cover;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }
  }

  .card-info {
    padding: ${px2rem(16)} ${px2rem(24)};
    background-color: ${({ theme }: { theme: DefaultTheme }) => theme.bg['nft-item']};
    border-bottom-left-radius: ${px2rem(8)};
    border-bottom-right-radius: ${px2rem(8)};

    .card-title1 {
      font-style: normal;
      font-weight: 500;
      font-size: ${px2rem(22)};
      line-height: ${px2rem(30)};
      color: ${({ theme }: { theme: DefaultTheme }) => theme['text-primary']};
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .card-title2 {
      font-style: normal;
      font-weight: 500;
      font-size: ${px2rem(18)};
      line-height: ${px2rem(28)};
      color: ${({ theme }: { theme: DefaultTheme }) => theme['text-secondary']};
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .card-title3 {
      font-style: normal;
      font-weight: 500;
      font-size: ${px2rem(16)};
      line-height: ${px2rem(26)};
      margin-top: ${px2rem(16)};
      color: ${({ theme }: { theme: DefaultTheme }) => theme['text-secondary']};
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }

  .owner-actions {
    padding: ${px2rem(16)} ${px2rem(24)};
    padding-top: ${px2rem(4)};
    .transfer-button {
      /* background-color: ${({ theme }: { theme: DefaultTheme }) => theme.bg5}; */
      padding: ${px2rem(6)} ${px2rem(14)};
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      font-size: ${px2rem(14)};
      line-height: ${px2rem(24)};
      /* color: ${({ theme }: { theme: DefaultTheme }) => theme.primary.brand}; */
      width: 100%;
      font-style: normal;
      border-radius: 2px;
    }
  }
`;
