import { MainModal } from '@/components/Modal/MainModal.styled';
import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledSignModal = styled(MainModal)`
  .container {
    width: 100%;
  }

  form {
    display: flex;
  }

  h5 {
    margin-top: ${px2rem(32)};
  }

  .label {
    font-size: ${px2rem(12)};
    font-weight: 500;
    margin-bottom: ${px2rem(6)};
    color: ${({ theme }) => theme.primary['5b']};
  }

  .btn-wrapper {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${px2rem(24)};
    margin-top: ${px2rem(24)};

    .btn {
      min-height: ${px2rem(42)};
      flex: 1;
      width: 100%;
    }
  }
`;

export const WrapperTx = styled.div`
  min-height: 60px;
`;

export const ButtonsWrapper = styled.div``;
