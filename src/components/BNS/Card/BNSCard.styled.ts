import px2rem from '@/utils/px2rem';
import styled, { DefaultTheme } from 'styled-components';

export const StyledBNSCard = styled.div`
  &.card {
    width: 100%;
    height: auto;
    text-decoration: none;
    --bs-card-bg: none;
  }

  .card-content {
    background: ${({ theme }: { theme: DefaultTheme }) => theme.card.bns};
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: ${px2rem(8)};

    :hover {
      border: 1px solid ${({ theme }: { theme: DefaultTheme }) => theme['text-primary']};
    }
  }

  .card-info {
    padding: ${px2rem(16)} ${px2rem(24)};

    .title-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      .card-title {
        font-style: normal;
        font-weight: 500;
        font-size: ${px2rem(20)};
        line-height: ${px2rem(30)};
        letter-spacing: -0.01em;
        color: ${({ theme }: { theme: DefaultTheme }) => theme['text-primary']};
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }

    .card-transfer-btn {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: ${px2rem(6)};
      cursor: pointer;
      width: fit-content;

      :hover {
        opacity: 0.8;
      }

      img {
        width: ${px2rem(20)};
        height: ${px2rem(20)};
      }

      p {
        font-weight: 500;
        font-size: ${px2rem(16)};
        line-height: ${px2rem(26)};
        letter-spacing: 0.01em;

        color: ${({ theme }: { theme: DefaultTheme }) => theme['button-primary']};
      }
    }

    .sub-container {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-top: ${px2rem(20)};

      .sub-owner {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: ${px2rem(8)};

        .sub-address {
          font-style: normal;
          font-weight: 500;
          font-size: ${px2rem(16)};
          line-height: ${px2rem(26)};
          color: ${({ theme }: { theme: DefaultTheme }) => theme['text-primary']};
        }
      }

      .card-name {
        font-style: normal;
        font-weight: 500;
        font-size: ${px2rem(16)};
        line-height: ${px2rem(26)};
        color: ${({ theme }: { theme: DefaultTheme }) => theme['text-four']};
      }
    }
  }
`;
