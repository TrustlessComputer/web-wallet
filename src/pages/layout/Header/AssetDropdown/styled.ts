import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

export const Element = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${px2rem(12)};

  p {
    font-weight: 500;
    font-size: ${px2rem(18)};
    color: ${({ theme }) => theme['button-primary']};
    width: ${px2rem(112)};
    text-align: center;
  }

  .ele-indicator {
    height: ${px2rem(24)};
    width: ${px2rem(1)};
    background-color: ${({ theme }) => theme['border-primary']};
  }
`;

export const DropdownList = styled.div`
  display: grid;
  padding-top: ${px2rem(16)};
  gap: ${px2rem(24)} !important;

  .actions {
    display: flex;

    padding-top: ${px2rem(16)};
    padding-bottom: ${px2rem(4)};
    gap: ${px2rem(12)};
    width: 100%;
  }

  .actions-border-top {
    border-top: ${px2rem(1)} solid ${({ theme }) => theme['text-four']};
  }

  .create-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${px2rem(8)};
    cursor: pointer;

    :hover {
      opacity: 0.8;
    }

    .text-remove {
      margin-top: 2px;
      color: ${({ theme }) => theme.red.A};
    }
  }
`;

export const DropdownItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${px2rem(32)};

  .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${px2rem(12)};
  }

  .item-actions {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: ${px2rem(12)};

    .action {
      display: flex;
      align-items: center;
      justify-content: center;

      width: ${px2rem(28)};
      height: ${px2rem(28)};

      background: ${({ theme }) => theme.bg.third};
      border-radius: ${px2rem(4)};

      :hover {
        opacity: 0.8;
      }
    }

    .action-hide {
      background-color: transparent;
    }
  }
`;

export const MoreDropdownItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${px2rem(12)};

  :hover {
    opacity: 0.8;
    * {
      text-decoration: underline;
    }
  }

  .icon-remove {
    padding: ${px2rem(4)};
    background-color: ${({ theme }) => theme.red.C};
    border-radius: ${px2rem(4)};
  }

  .text-remove {
    color: ${({ theme }) => theme.red.C};
  }

  .icon-normal {
    padding: ${px2rem(4)};
    background-color: ${({ theme }) => theme.bg.third};
    border-radius: ${px2rem(4)};
  }

  .text-normal {
  }
`;

export const MoreDropdownList = styled.div`
  display: grid;
  gap: ${px2rem(16)} !important;
`;
