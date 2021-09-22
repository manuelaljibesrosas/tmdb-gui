import styled from '@emotion/styled';

type Props = {
  filled?: boolean;
};

const Button = styled.button<Props>`
  cursor: pointer;
  height: 32px;
  padding: 0 12px;
  border: ${({ filled }) => (filled ? 'none' : '2px solid #fff')};
  line-height: ${({ filled }) => (filled ? '30px' : '27px')};
  font-size: 13px;
  background: ${({ filled }) => (filled ? '#333' : 'transparent')};
  border-radius: 12px;
`;

export default Button;
