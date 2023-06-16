import React, { PropsWithChildren, useEffect, useImperativeHandle } from 'react';
import { PopoverWrapper, OverlayWrapper, Wrapper } from './styled';

interface IProps extends PropsWithChildren {
  icon?: React.ReactNode;
  width?: number;
  element?: React.ReactNode;
  unwrapElement?: React.ReactNode;
  closeDropdown?: boolean;
  type?: 'click' | 'hover';
}

export interface IDropdownRef {
  onToggle: () => void;
}

const Dropdown = React.forwardRef(
  (
    { icon, element, width, children, unwrapElement, closeDropdown, type = 'click' }: IProps,
    forwardedRef: React.ForwardedRef<IDropdownRef>,
  ) => {
    const [show, setShow] = React.useState(false);
    const ref = React.useRef(null);

    const handleOnMouseEnter = () => {
      setShow(true);
    };
    const handleOnMouseLeave = () => {
      setShow(false);
    };

    const onToggle = () => {
      setShow(!show);
    };

    const onClickWrapElement = (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      e.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
      onToggle();
    };

    useEffect(() => {
      if (closeDropdown) {
        setShow(false);
      }
    }, [closeDropdown]);

    useImperativeHandle(forwardedRef, () => ({
      onToggle,
    }));

    if (type === 'click') {
      return (
        <OverlayWrapper
          trigger={['click', 'focus']}
          placement="bottom-start"
          overlay={<PopoverWrapper width={width}>{children}</PopoverWrapper>}
          container={ref}
          show={show}
          onToggle={onToggle}
          rootClose
        >
          {unwrapElement ? (
            <div ref={ref} onClick={show ? onClickWrapElement : undefined}>
              {unwrapElement}
            </div>
          ) : (
            <Wrapper ref={ref} show={show} onClick={show ? onClickWrapElement : undefined}>
              <div className="element">
                {icon && icon}
                {element && element}
                <div className="arrow" />
              </div>
            </Wrapper>
          )}
        </OverlayWrapper>
      );
    }

    return (
      <OverlayWrapper
        trigger={['hover', 'focus']}
        placement="bottom-start"
        overlay={
          <PopoverWrapper
            width={width}
            hidePadding={!show}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          >
            {show && children}
          </PopoverWrapper>
        }
        container={ref}
        show={show}
      >
        {unwrapElement ? (
          <div ref={ref} onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}>
            {unwrapElement}
          </div>
        ) : (
          <Wrapper ref={ref} show={show} onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}>
            <div className="element">
              {icon && icon}
              {element && element}
            </div>
          </Wrapper>
        )}
      </OverlayWrapper>
    );
  },
);

export default Dropdown;
