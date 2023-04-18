import styled, { DefaultTheme } from 'styled-components';

export const StyledButton = styled.button<{ bg: string; color: string }>`
  --bg-color: ${({ bg, theme }: { bg: string; theme: DefaultTheme }) => (theme as any)[bg] || theme.white};
  --text-color: ${({ color, theme }: { color: string; theme: DefaultTheme }) => (theme as any)[color] || theme.text8};

  border-radius: 200px;
  background-color: var(--bg-color);
  color: var(--text-color);
  border: none;
  padding: 0;
  outline: none;

  &:disabled {
    background-color: var(--bg-color);
    opacity: 0.8;
    cursor: auto;
  }
  &:hover {
    background-color: var(--bg-color);
    opacity: 0.8;
  }

  &:active {
    background-color: var(--bg-color);
  }

  &.btn-primary {
    --bs-btn-active-color: #fff;
    --bs-btn-active-bg: var(--bg-color);
    --bs-btn-active-border-color: var(--bg-color);
    --bs-btn-disabled-bg: var(--bg-color);
    --bs-btn-disabled-border-color: var(--bg-color);
  }
`;
