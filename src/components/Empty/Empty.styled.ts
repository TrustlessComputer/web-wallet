import styled from 'styled-components';

export const StyledEmpty = styled.div<{ isTable: boolean }>`
  min-width: 300px;
  &.notFound {
    display: grid;
    place-items: center;
    position: relative;
    .image {
      margin-bottom: rem(32px);
      padding: 0 !important;
    }
    .link {
      color: ${({ theme }) => theme['text-highlight']};
    }
    p,
    a {
      padding: 0;
    }
  }
`;
