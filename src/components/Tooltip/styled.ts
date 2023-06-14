import styled from 'styled-components';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import px2rem from '@/utils/px2rem';

const PopoverWrapper = styled(Tooltip)<{ width?: number }>``;

const OverlayWrapper = styled(OverlayTrigger)``;

const Wrapper = styled.div<{ show?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: ${({ theme, show }) => (show ? theme.yellow.A : 'transparent')};
  border: 1px solid ${({ theme }) => theme['border-primary']};
  padding: ${px2rem(0)} ${px2rem(12)};
  border-radius: ${px2rem(8)};
  height: ${px2rem(48)};
  cursor: pointer;

  .element {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${px2rem(12)};
    p {
      color: ${({ theme, show }) => (show ? theme.dark[100] : theme['button-primary'])};
    }
  }

  :hover {
    opacity: ${({ show }) => (show ? 1 : 0.8)};
  }
`;

export { PopoverWrapper, OverlayWrapper, Wrapper };
