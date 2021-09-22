/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';

const shortenName = (name: string) => {
  if (name.length <= 10) return name;

  const [firstName, surName] = name.split(' ').slice(0, 2);

  return `${firstName} ${surName[0].toUpperCase()}.`;
};

type Props = {
  name: string;
  profileURL: string;
  role: string;
  isLastInList: boolean;
  remainingItems: number;
};

const CastMember: React.FC<Props> = ({
  name,
  profileURL,
  role,
  isLastInList,
  remainingItems,
}) => (
  <div
    css={css`
      width: 25%;
      display: flex;
      flex-direction: column;
      align-items: center;
    `}
  >
    <div
      css={css`
        position: relative;
      `}
    >
      <img
        css={css`
          margin-bottom: 10px;
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 50%;
        `}
        src={`https://image.tmdb.org/t/p/w45/${profileURL}`}
        alt={name}
      />
      {((isLastInList && remainingItems > 0) || null) && (
        <div
          css={css`
            transform: translateX(-50%);
            position: absolute;
            top: 0;
            left: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
            background-color: #28282882;
            border-radius: 50%;
            width: 50px;
            height: 50px;
          `}
        >
          {`+${remainingItems}`}
        </div>
      )}
    </div>
    <div
      css={css`
        display: flex;
        flex-direction: column;
        text-align: center;
      `}
    >
      <h4
        css={css`
          font-weight: 400;
          font-size: 12px;
        `}
      >
        {shortenName(name)}
      </h4>
      <div
        css={css`
          font-size: 11px;
          color: #777;
        `}
      >
        {shortenName(role)}
      </div>
    </div>
  </div>
);

export default CastMember;
