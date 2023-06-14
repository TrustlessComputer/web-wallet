import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  .showAll {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: ${px2rem(12)};
    margin-bottom: ${px2rem(16)};
    cursor: pointer;

    p {
      font-weight: 400;
      font-size: ${px2rem(18)};
      line-height: ${px2rem(28)};
    }
  }

  .list {
    min-height: 60vh;

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none;

    ::-webkit-scrollbar {
      display: none; /* for Chrome, Safari, and Opera */
    }
  }

  .loading {
    display: flex;
    justify-content: center;
    margin-top: ${px2rem(32)};
  }

  .item {
    padding: ${px2rem(16)} ${px2rem(12)} !important;
  }
`;

const Grid = styled.div`
  display: grid;
  justify-items: center;
  grid-gap: ${px2rem(24)};
  grid-template-columns: repeat(4, minmax(0, 1fr));

  @media screen and (max-width: 1280px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`;

export { Container, Grid };
