import styled from 'styled-components';
import Spinner from '@/components/Spinner';
import { opacify } from '@/utils';

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  background-color: ${({ theme }) => opacify(100, theme.bg1)};
  align-items: center;
  justify-content: center;
`;

const LoadingContainer = ({ loaded }: { loaded: boolean }) => {
  if (loaded) return null;

  return (
    <Container>
      <Spinner />
    </Container>
  );
};

export default LoadingContainer;
