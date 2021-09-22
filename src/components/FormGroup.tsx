/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';

type Props = {
  name: string;
};

const FormGroup: React.FC<Props> = ({ name, children }) => (
  <div
    css={css`
      margin-bottom: 15px;

      &:last-child {
        margin-bottom: 0;
      }
    `}
  >
    <label
      css={css`
        margin-bottom: 12px;
        display: block;
        line-height: 1;
        color: #f1f1f1;
      `}
    >
      {name}
    </label>
    {children}
  </div>
);

export default FormGroup;
