import { MainModal } from '@/components/Modal/MainModal.styled';
import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const Container = styled(MainModal)`
  .container {
    width: 100%;
  }

  form {
    display: flex;
  }

  .header-title {
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
  .row-bw {
    display: flex;
    padding: 8px;
    justify-content: space-between;
    .tc-hash {
      margin-bottom: 8px;
      width: fit-content;
    }
  }
  .icCopy {
    cursor: pointer;
    width: fit-content;
    :hover {
      opacity: 0.8;
    }
  }
`;
