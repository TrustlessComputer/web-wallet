import px2rem from '@/utils/px2rem';
import styled from 'styled-components';
import { Modal } from 'react-bootstrap';

export const StyledTransferModal = styled(Modal)`
  &.modal {
    --bs-modal-color: ${({ theme }) => theme.bg1};
    --bs-modal-width: ${px2rem(600)};
  }

  .modal-header {
    border-bottom: none;
    padding: 0;
    display: flex;
    justify-content: flex-end;
    padding-top: ${px2rem(18)};
    padding-right: ${px2rem(18)};
  }

  .modal-content {
    border-radius: 2px;
    padding: ${px2rem(16)};
  }

  * {
    font-family: 'Bandeins Strange Variable' !important;
  }

  .label {
    font-size: ${px2rem(12)};
    font-weight: 500;
    margin-bottom: ${px2rem(6)};
    color: ${({ theme }) => theme.primary['5b']};
  }

  .divider {
    margin-top: ${px2rem(16)};
    margin-bottom: ${px2rem(16)};
    height: 1px;
    width: 100%;
    background: ${({ theme }) => theme.bg4};
  }

  .est-fee {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${px2rem(24)};
  }

  .est-fee-value {
    display: flex;
    align-items: center;
    gap: ${px2rem(14)};
  }

  .transfer-btn {
    width: 100%;
    margin-top: ${px2rem(8)};

    .transfer-text {
      padding-top: ${px2rem(11)};
      padding-bottom: ${px2rem(11)};
    }
  }
`;
