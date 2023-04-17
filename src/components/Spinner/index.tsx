import { Container } from '@/components/Spinner/styled';

interface IProps {
  className?: string;
}

const Spinner = ({ className }: IProps) => (
  <Container className={className}>
    <div className="ring" />
    <div className="ring" />
    <div className="dot" />
  </Container>
);

export default Spinner;
