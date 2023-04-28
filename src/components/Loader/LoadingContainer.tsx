import styled from 'styled-components';
import Spinner from '@/components/Spinner';
import { opacify } from '@/utils';

const Container = styled.div<{ opacity: number }>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ opacity, theme }) => opacify(opacity, theme.bg1)};
`;

const LoadingContainer = ({ loaded, opacity = 0 }: { loaded: boolean; opacity?: number }) => {
  if (loaded) return null;

  return (
    <Container opacity={opacity}>
      <Spinner />
    </Container>
  );
};

export default LoadingContainer;
