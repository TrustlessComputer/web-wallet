import { MainModal } from '@/components/Modal/MainModal.styled';
import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledSignModal = styled(MainModal)`
  * {
    font-family: 'Bandeins Strange Variable' !important;
  }

  .container {
    width: 100%;
  }

  form {
    display: flex;
  }

  .header-title {
    margin-top: ${px2rem(32)};
  }

  .label {
    font-size: ${px2rem(12)};
    font-weight: 500;
    margin-bottom: ${px2rem(6)};
    color: ${({ theme }) => theme.primary['5b']};
  }

  .btn-wrapper {
    margin-top: ${px2rem(32)};
    flex: 1;
    display: flex;
    gap: ${px2rem(24)};
    .text-cancel {
      color: #ffaa59;
    }
    .btn-cancel {
      border: 1px solid #ffaa59;
      min-height: ${px2rem(42)};
      flex: 1;
      background: transparent;
    }
    .btn-submit {
      background: #ffaa59;
      flex: 1;
      min-height: ${px2rem(42)};
      p {
        color: white;
      }
    }
  }
`;

export const WrapperTx = styled.div`
  min-height: 60px;
  .row-bw {
    display: flex;
    padding: 8px;
    justify-content: space-between;
    .right {
    }
  }
`;
