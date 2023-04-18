import { Container } from '@/components/Spinner/styled';

interface IProps {
  className?: string;
}

const Spinner = ({ className }: IProps) => (
  <Container className={className}>
    <span />
  </Container>
);

export default Spinner;
