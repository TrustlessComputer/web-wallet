import { MainModal } from '@/components/Modal/MainModal.styled';
import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledSendBTCModal = styled(MainModal)`
  .label {
    font-size: ${px2rem(12)};
    font-weight: 500;
    margin-bottom: ${px2rem(6)};
    color: white;
  }

  .divider {
    margin-top: ${px2rem(16)};
    margin-bottom: ${px2rem(16)};
    height: 1px;
    width: 100%;
    background: ${({ theme }) => theme.bg4};
  }

  .transfer-btn {
    width: 100%;
    margin-top: ${px2rem(8)};
    background-color: #ffaa59;

    .transfer-text {
      padding-top: ${px2rem(11)};
      padding-bottom: ${px2rem(11)};
    }
  }
  .row-bw {
    display: flex;
    padding: 8px;
    justify-content: space-between;
    .right {
    }
  }
`;

export const ItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 32px;
  background-color: #2e2e2e;
  border-radius: 8px;
  justify-content: space-between;
  line-break: auto;
  .icCopy {
    width: ${px2rem(32)};
    height: ${px2rem(32)};
    display: grid;
    place-items: center;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
    cursor: pointer;
    margin-left: 32px;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    img {
      max-width: ${px2rem(16)};
    }
  }
`;
