import { MainModal } from '@/components/Modal/MainModal.styled';
import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledSendBTCModal = styled(MainModal)`
  .row-header {
    display: flex;
    justify-content: space-between;
  }

  .label {
    font-size: ${px2rem(12)};
    font-weight: 500;
    margin-bottom: ${px2rem(6)};
    color: white;
  }

  .max {
    border: 1px solid ${({ theme }) => theme.text1};
    padding: 2px 12px;
    border-radius: 4px;
    cursor: pointer;
    :hover {
      opacity: 0.8;
    }
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
    margin-top: ${px2rem(16)};
  }
  .row-bw {
    display: flex;
    padding-bottom: 4px;
    /* padding: 8px; */
    justify-content: space-between;
    .right {
    }
  }
`;

export const WrapInput = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${px2rem(16)};

  .title-input {
    font-weight: 500;
    font-size: ${px2rem(12)};
    line-height: ${px2rem(20)};
    text-transform: uppercase;
    margin-bottom: ${px2rem(4)};
  }

  .input {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: ${px2rem(12)};
    gap: ${px2rem(16)};
    font-weight: 400;
    font-size: ${px2rem(16)};
    line-height: ${px2rem(26)};
    border: 1px solid ${({ theme }) => theme.border3};
    color: white;
  }

  .error {
    font-weight: 400;
    font-size: ${px2rem(14)};
    line-height: ${px2rem(24)};
    color: ${({ theme }) => theme.text6};
  }
`;
