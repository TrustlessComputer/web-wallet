import styled, { DefaultTheme } from 'styled-components';
import px2rem from '@/utils/px2rem';

import IcDiscord from '@/assets/icons/ic_discord.svg';
import IcTwitter from '@/assets/icons/ic_twitter.svg';
import IcGithub from '@/assets/icons/ic_github.svg';
import { StyledLink } from '../Header/Header.styled';
import { CDN_URL } from '@/configs';
import { TC_EXPLORER } from '@/constants/url';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${px2rem(140)};
  flex-wrap: wrap;
  gap: ${px2rem(32)};
  @media screen and (max-width: ${({ theme }: { theme: DefaultTheme }) => theme.breakpoint.md}) {
    gap: ${px2rem(16)};
  }

  .text {
    font-style: normal;
    font-weight: 500;
    font-size: ${px2rem(14)};
    line-height: ${px2rem(26)};
    margin-right: ${px2rem(16)};
    color: ${({ theme }: { theme: DefaultTheme }) => theme.white};

    @media screen and (max-width: ${({ theme }: { theme: DefaultTheme }) => theme.breakpoint.md}) {
      order: 2;
      padding-bottom: ${px2rem(32)};
    }
  }

  .footer-right {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: ${px2rem(32)};

    @media screen and (max-width: ${({ theme }: { theme: DefaultTheme }) => theme.breakpoint.md}) {
      order: 1;
    }

    a {
      color: ${({ theme }: { theme: DefaultTheme }) => theme.white};
      display: flex;
      align-items: center;
      gap: ${px2rem(8)};
      font-size: ${px2rem(16)};
      line-height: ${px2rem(28)};
      font-weight: 500;

      &:hover {
        opacity: 0.8;
        text-decoration: none;
        cursor: pointer;
      }

      .arrow-icon {
        width: 9px;
        height: 9px;
      }
    }
  }

  .buttonContainer {
    display: flex;
    flex-direction: row;
    align-items: center;

    gap: ${px2rem(8)};

    .icon {
      width: ${px2rem(34)};
      height: ${px2rem(34)};
      cursor: pointer;

      :hover {
        opacity: 0.8;
      }
    }
  }
`;

const Footer = ({ height }: { height: number }) => {
  return (
    <Wrapper style={{ height }}>
      <p className="text">Open-source software. Made with ❤️ on Bitcoin.</p>
      <div className="footer-right">
        <StyledLink active={false} href="https://trustless.computer/" target="_blank">
          Trustless
          <img className="arrow-icon" src={`${CDN_URL}/icons/ic-arrow-outward.svg`} alt="" />
        </StyledLink>
        <StyledLink active={false} href={TC_EXPLORER} target="_blank">
          Explorer
          <img className="arrow-icon" src={`${CDN_URL}/icons/ic-arrow-outward.svg`} />
        </StyledLink>
        <div className="buttonContainer">
          <a href="https://github.com/trustlesscomputer" target="_blank">
            <img alt="icon" className="icon" src={IcGithub} />
          </a>
          <a href="https://generative.xyz/discord" target="_blank">
            <img alt="icon" className="icon" src={IcDiscord} />
          </a>
          <a href="https://twitter.com/NewBitcoinCity" target="_blank">
            <img alt="icon" className="icon" src={IcTwitter} />
          </a>
        </div>
      </div>
    </Wrapper>
  );
};

export default Footer;
