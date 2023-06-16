import React from 'react';
import { Outlet } from 'react-router-dom';
import Meta from './Meta';
import Footer from './Footer';
import Header from './Header';
import styled, { DefaultTheme } from 'styled-components';
import px2rem from '@/utils/px2rem';

const HEADER_HEIGHT = 96;
const FO0TER_HEIGHT = 80;

export const Root = styled.div`
  background: ${({ theme }) => theme.bg.primary};
`;

export const Container = styled.div`
  min-height: 100vh;
  max-width: 1920px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  padding: 0 ${px2rem(32)};
  background: ${({ theme }) => theme.bg.primary};

  ${({ theme }: { theme: DefaultTheme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
      padding-left: 7%;
      padding-right: 7%;
  `}
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  background: ${({ theme }) => theme.bg.secondary};
  padding: 0 ${px2rem(32)};

  ${({ theme }: { theme: DefaultTheme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
      padding-left: 7%;
      padding-right: 7%;
  `}
`;

const ContentWrapper = styled.div`
  min-height: calc(100vh - 140px);
  display: flex;
  align-self: center;
  width: 100%;

  > div {
    width: 100%;
  }
`;

const Layout = () => {
  return (
    <Root>
      <Meta />
      <HeaderContainer>
        <Header height={HEADER_HEIGHT} />
      </HeaderContainer>
      <Container>
        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
        <Footer height={FO0TER_HEIGHT} />
      </Container>
    </Root>
  );
};

export default Layout;
