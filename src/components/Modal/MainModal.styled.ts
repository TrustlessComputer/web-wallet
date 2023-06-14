import px2rem from '@/utils/px2rem';
import { Modal } from 'react-bootstrap';
import styled from 'styled-components';

export const MainModal = styled(Modal)`
  &.modal {
    --bs-modal-color: ${({ theme }) => theme.bg1};
    --bs-modal-width: ${px2rem(800)};
  }
  .modal-dialog-centered {
    justify-content: center;
  }

  .modal-content {
    border-radius: 2px;
    padding: ${px2rem(16)};
    background: ${({ theme }) => theme.bg1};
  }

  .modal-header {
    border-bottom: none;
    padding: 0;
    display: flex;
    justify-content: flex-end;
    padding-top: ${px2rem(18)};
    padding-right: ${px2rem(18)};
  }

  .modal-body {
    padding-top: 0;
  }

  .modal-footer {
    border-top: none;
  }
`;
