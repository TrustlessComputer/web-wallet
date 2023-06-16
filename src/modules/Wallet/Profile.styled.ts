import px2rem from '@/utils/px2rem';
import styled from 'styled-components';
import { DefaultTheme } from 'styled-components';

export const StyledProfile = styled.div`
  margin-top: ${px2rem(40)};
  row-gap: ${px2rem(40)};
`;

export const TabContainer = styled.div`
  padding: 0;
  .nav-tabs {
    border: none;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: ${px2rem(40)};
    gap: ${px2rem(0)};
    flex-wrap: nowrap;
    min-height: ${px2rem(54)};
    overflow-x: scroll;

    -ms-overflow-style: none;
    scrollbar-width: none;
    width: fit-content;

    border: 1px solid ${({ theme }: { theme: DefaultTheme }) => theme['border-primary']};
    border-radius: ${px2rem(40)};
    padding: ${px2rem(4)} ${px2rem(8)};

    &::-webkit-scrollbar {
      display: none;
    }

    .nav-link {
      opacity: 0.5;
      border: none;
      transition: 0.2s ease;

      padding-bottom: 0px;
      padding-left: ${px2rem(32)};
      padding-right: ${px2rem(32)};
      margin-bottom: 1px;

      border-radius: ${px2rem(100)};

      &:hover {
        opacity: 0.75;
      }
    }

    .nav-link.active {
      background-color: transparent;
      border: none;
      color: ${({ theme }: { theme: DefaultTheme }) => theme['text-primary']};
      opacity: 1;
      background: ${({ theme }: { theme: DefaultTheme }) => theme.bg['tab-item']};
      border-radius: ${px2rem(100)};

      /* .tab-item::after {
        content: '';
        display: block;
        width: 100%;
        height: 1px;
        position: absolute;
        bottom: 0;
        background-color: ${({ theme }: { theme: DefaultTheme }) => theme.white};
      } */
    }
  }

  .tab-item {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    position: relative;
    padding-bottom: ${px2rem(8)};
    /* max-height: ${px2rem(30)}; */
  }

  .tab-text {
    font-size: ${px2rem(16)};
    font-weight: 500;
  }

  /* .nav-item:last-of-type {
    flex: 1;

    .nav-link {
      opacity: 1;
    }

    > button {
      margin-left: auto;
    }
  } */

  .explore-btn {
    display: flex;
    align-items: center;
    background: ${({ theme }: { theme: DefaultTheme }) => theme.btn3};
    padding: ${px2rem(8)} ${px2rem(24)};
    gap: ${px2rem(4)};
    * {
      font-weight: 500;
    }

    &.disable {
      display: none;
      pointer-events: none;
      opacity: 0.5;
    }

    &.resume-btn {
      justify-content: center;
    }
  }

  .tab-content {
    min-height: ${px2rem(300)};
    position: relative;

    .empty {
      min-height: ${px2rem(300)};
    }

    .notFound {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  ${({ theme }: { theme: DefaultTheme }) => theme.deprecated_mediaWidth.deprecated_upToSmall`
    .tab-text {
      display: none;
    }
  `};
`;
