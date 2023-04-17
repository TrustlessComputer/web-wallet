import styled from 'styled-components';
import px2rem from '@/utils/px2rem';
import Button from '@/components/Button';

export const Wrapper = styled.div`
  .content {
    min-height: calc(100vh - 82px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .logo {
      margin-bottom: ${px2rem(36)};
    }

    .title {
      max-width: 600px;
      font-weight: 500;
      font-size: ${px2rem(24)};
      line-height: ${px2rem(34)};
      color: #fff;
      text-align: center;
      margin-bottom: ${px2rem(36)};
    }
  }
`;

export const ConnectWalletButton = styled(Button)`
  background: ${({ theme }) => theme.bg6};
  padding: ${px2rem(15)} ${px2rem(24)};
  color: ${({ theme }) => theme.text1};
  min-width: ${px2rem(230)};
`;
