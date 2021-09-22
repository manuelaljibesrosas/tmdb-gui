/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { useHistory, useLocation } from 'react-router-dom';
// components
import Container from 'components/Container';
import BookmarkIcon from 'assets/bookmark-icon.svg';
import ShareIcon from 'assets/share-icon.svg';

const MoviesListBar: React.FC = () => (
  <Container
    css={css`
      position: absolute;
      top: 20px;
      left: 0;
      z-index: 20;
      height: 45px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `}
  >
    <div
      css={css`
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      <svg width="50px" height="15px">
        <path
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          d="
            M 2.5,2.5
            h 25
            M 2.5,13
            h 18
          "
        />
      </svg>
    </div>
    <div
      css={css`
        cursor: pointer;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background-color: pink;
        background-image: url('https://randomuser.me/api/portraits/men/1.jpg');
        background-size: cover;
      `}
    />
  </Container>
);

const MovieDetailsBar: React.FC = () => {
  const history = useHistory();

  return (
    <Container
      css={css`
        position: absolute;
        top: 20px;
        left: 0;
        z-index: 20;
        height: 45px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      `}
    >
      <div
        css={css`
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
        `}
        onClick={history.goBack}
      >
        <svg width="20px" height="25px">
          <path
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            d="
              M 15.5,2.5
              L 6,12.5
              L 15.5,22.5
            "
          />
        </svg>
      </div>
      <div
        css={css`
          display: flex;
        `}
      >
        <div
          css={css`
            margin-right: 25px;
            cursor: pointer;
            width: 25px;
            height: 25px;
          `}
        >
          <ShareIcon width={25} height={25} stroke="#fff" />
        </div>
        <div
          css={css`
            cursor: pointer;
            width: 25px;
            height: 25px;
          `}
        >
          <BookmarkIcon width={25} height={25} />
        </div>
      </div>
    </Container>
  );
};

const StatusBar: React.FC = () => {
  const { pathname } = useLocation();

  if (pathname.match(/details/) !== null) return <MovieDetailsBar />;

  return <MoviesListBar />;
};

export default StatusBar;
