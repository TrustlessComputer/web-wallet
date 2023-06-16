import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import px2rem from '@/utils/px2rem';

const Container = styled.div`
  margin-top: 32px;
`;

const Content = styled(Row)`
  margin-top: 24px;
  margin-bottom: 42px;
  gap: 12px;
`;

const ItemWrapper = styled(Col)<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme, isActive }) => (isActive ? theme['button-primary'] : theme.border2)};
  border-radius: 4px;
  padding-top: 12px;
  padding-bottom: 12px;
  cursor: pointer;
  position: relative;
  :hover {
    border-color: ${({ theme }) => theme['button-primary']};
  }
  .price {
    margin-top: ${px2rem(16)};
    font-size: ${px2rem(20)};
    text-align: center;
  }
  .vbyte {
    margin-top: ${px2rem(8)};
    font-weight: 400;
    line-height: 140%;
    text-align: center;
    color: ${({ theme }) => theme.text3};
  }

  .custom-input {
    margin-top: ${px2rem(16)};
    font-size: ${px2rem(24)};
    color: white;
    text-align: center;
    padding-top: 4px;
    padding-bottom: 4px;
    border: 1px solid ${({ theme }) => theme.border2};
  }
`;

export { Container, Content, ItemWrapper };
