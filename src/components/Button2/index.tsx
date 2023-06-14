import React, { PropsWithChildren } from 'react';
import { StyledButton } from './Button2.styled';
import { ButtonSizes, ButtonVariants } from '@/components/Button2/button2.type';
import cs from 'classnames';
import IconSVG from '../IconSVG';
import { CDN_URL_ICONS } from '@/configs';

export type ButtonProps = {
  onClick?: (e: any) => void;
  className?: string;
  disabled?: boolean;
  props?: HTMLButtonElement;
  type?: 'submit' | 'reset' | 'button' | undefined;
  variants?: ButtonVariants;
  sizes?: ButtonSizes;
  isLoading?: boolean;
  rightIcon?: React.ReactNode;
  isArrowRight?: boolean;
};

const Button2 = ({
  type,
  className,
  onClick,
  children,
  variants = 'primary',
  sizes = 'normal',
  rightIcon,
  isArrowRight,
  ...props
}: PropsWithChildren<ButtonProps>) => {
  return (
    <StyledButton type={type} className={cs(className, variants, sizes)} onClick={onClick} {...props}>
      {children}
      {!!rightIcon && rightIcon}
      {isArrowRight && <IconSVG src={`${CDN_URL_ICONS}/ic-arrow-right-dark.svg`} maxWidth="20" />}
    </StyledButton>
  );
};

export default Button2;
