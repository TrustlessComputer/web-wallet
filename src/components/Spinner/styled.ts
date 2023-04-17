import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${px2rem(20)};
  height: ${px2rem(20)};

  div {
    position: absolute;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;

    &.ring {
      border-width: 0.5rem;
      border-style: solid;
      border-color: transparent;
      animation: 2s fancy infinite alternate;

      &:nth-child(1) {
        border-left-color: #ff8008;
        border-right-color: #ff8008;
      }
      &:nth-child(2) {
        border-top-color: #ff8008;
        border-bottom-color: #ff8008;
        opacity: 0.8;
        animation-delay: 1s;
      }
    }

    &.dot {
      width: 1rem;
      height: 1rem;
      background: ${({ theme }) => theme.bg6};
    }
  }

  @keyframes fancy {
    to {
      transform: rotate(360deg) scale(0.5);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export { Container };
