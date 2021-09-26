/** @jsx jsx */
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { css, jsx } from '@emotion/react';
import { genres } from 'shared/constants';
import { Genre } from 'services/moviesList/reducer';
import { routes } from 'shared/router';
// components
import StarIcon from 'assets/star-icon.svg';

// TODO: duplicate in components/MovieItem
const renderGenres = (genreIds: Array<number>) =>
  genreIds
    .map((id) => (genres.find((genre) => genre.id === id) as Genre).name)
    .join(', ');

type Props = {
  id: number;
  title: string;
  posterURL: string;
  releaseDate: string;
  rating: number;
  genres: Array<number>;
};

const SmallMoviePreview: React.FC<Props> = ({
  id,
  title,
  posterURL,
  releaseDate,
  rating,
  genres,
}) => {
  const history = useHistory();

  const navigateToDetailsPage = useCallback(() => {
    history.push(`${routes.MOVIE_DETAILS}/${id}`);
  }, [history]);

  return (
    <div
      css={css`
        margin-bottom: 14px;
        height: 85px;
        width: 100%;
        padding: 5px;
        display: flex;
        align-items: center;
        border-radius: 10px;
        background: #1b191e;
        background-image: linear-gradient(45deg, #0f0f118a 60%, transparent);

        &:last-child {
          margin-bottom: 0;
        }
      `}
      onClick={navigateToDetailsPage}
    >
      <img
        css={css`
          margin-right: 10px;
          width: 70px;
          height: 70px;
          object-fit: cover;
          border-radius: 8px;
        `}
        src={`https://image.tmdb.org/t/p/w154${posterURL}`}
        alt=""
      />
      <div
        css={css`
          display: flex;
          flex-direction: column;
        `}
      >
        <h4
          css={css`
            margin-bottom: 5px;
            font-weight: 300;
            line-height: 1;
          `}
        >
          {title}
        </h4>
        <div
          css={css`
            margin-bottom: 5px;
            font-size: 11px;
            color: #777;
          `}
        >{`${releaseDate.split('-')[0]} | ${renderGenres(
          genres.slice(0, 2),
        )}`}</div>
        <div
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          <StarIcon
            css={css`
              margin-right: 5px;
            `}
            width={10}
            height={10}
            fill="#fbffad"
          />
          <div
            css={css`
              font-size: 11px;
              line-height: 1;
            `}
          >
            {rating.toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmallMoviePreview;
