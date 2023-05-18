import px2rem from '@/utils/px2rem';
import styled, { DefaultTheme } from 'styled-components';

export const StyledUserInfo = styled.div`
  /* .info {
    display: flex;
    align-items: center;
    gap: ${px2rem(20)};
  } */
  --avatar-desktop: block;
  --avatar-tablet: block;
  --avatar-mobile: block;

  .avatar {
    margin-bottom: ${px2rem(24)};
    .paper {
      border-radius: 50% !important;
    }
  }

  .address {
    color: ${({ theme }: { theme: DefaultTheme }) => theme.white};
    .ic-token {
      margin-top: 6px;
    }

    .wallet-address {
      display: flex;
      align-items: center;
      gap: ${px2rem(16)};
      /* margin-bottom: ${px2rem(16)}; */

      h5 {
        font-size: ${px2rem(20)};
        font-family: 'Bandeins Strange Variable' !important;
        font-weight: 500;
        flex: 1;
      }
    }
    .btc-address {
      display: flex;
      //align-items: center;
      align-items: flex-start;
      gap: ${px2rem(12)};
      margin-bottom: ${px2rem(24)};
    }
  }

  .icCopy {
    width: ${px2rem(32)};
    height: ${px2rem(32)};
    display: grid;
    place-items: center;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
    cursor: pointer;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    img {
      max-width: ${px2rem(16)};
    }
  }

  .balance {
    .balance-item {
      display: flex;
      align-items: center;
      gap: ${px2rem(16)};
    }
    .balance-content {
      color: ${({ theme }: { theme: DefaultTheme }) => theme.white};
    }
  }

  .disconnect-btn {
    display: flex;
    align-items: center;
    gap: ${px2rem(12)};
    cursor: pointer;
    &:hover {
      opacity: 0.75;
    }

    img {
      max-width: 18px;
    }
  }

  .share-btn {
    display: flex;
    align-items: center;
    gap: ${px2rem(12)};
    cursor: pointer;
    margin-bottom: 12px;

    &:hover {
      opacity: 0.75;
    }
    img {
      max-width: 18px;
      filter: sepia(100%) saturate(200%) brightness(1300%) hue-rotate(330deg);
    }
  }

  .send-btn {
    display: flex;
    align-items: center;
    gap: ${px2rem(12)};
    cursor: pointer;
    margin-bottom: ${px2rem(12)};
    &:hover {
      opacity: 0.75;
    }
    img {
      width: 18px;
    }
  }
`;
