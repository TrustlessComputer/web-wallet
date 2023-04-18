import styled from 'styled-components';

const Container = styled.div`
  width: 30px;
  height: 30px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  span {
    display: block;
    width: 30px;
    height: 30px;
    border: 3px solid transparent;
    border-radius: 50%;
    border-right-color: ${({ theme }) => theme.btn2};
    animation: spinner-anim 0.8s linear infinite;
  }

  @keyframes spinner-anim {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export { Container };
