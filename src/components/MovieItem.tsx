/** @jsx jsx */
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { jsx, css } from '@emotion/react';
import { routes } from 'shared/router';
import { genres } from 'shared/constants';
// components
import StarIcon from 'assets/star-icon.svg';
import { Genre } from 'services/moviesList/reducer';

const renderGenres = (genreIds: Array<number>) =>
  genreIds
    .map((id) => (genres.find((genre) => genre.id === id) as Genre).name)
    .join(', ');

type Props = {
  id: number;
  posterURL: string;
  title: string;
  rating: number;
  releaseYear: string;
  genres: Array<number>;
};

const MovieItem: React.FC<Props> = ({
  id,
  posterURL,
  title,
  rating,
  releaseYear,
  genres,
}) => {
  const history = useHistory();

  const navigateToDetailsPage = useCallback(() => {
    history.push(`${routes.MOVIE_DETAILS}/${id}`);
  }, [history]);

  return (
    <li
      css={css`
        cursor: pointer;
        height: 290px;
        display: flex;
        flex-direction: column;
        margin: 5px;
      `}
      onClick={navigateToDetailsPage}
    >
      <img
        css={css`
          height: 220px;
          background: gray;
          object-fit: cover;
          border-radius: 10px;
        `}
        src={posterURL}
        alt="movie poster thumbnail"
      />
      <div
        css={css`
          padding: 10px 0 5px;
          display: flex;
          height: 70px;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
        `}
      >
        <div
          css={css`
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 1;
          `}
        >
          {title}
        </div>
        <div
          css={css`
            width: 100%;
            overflow: hidden;
            font-weight: 300;
            line-height: 1;
            font-size: 12px;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #65706d;
          `}
        >
          {`${releaseYear} | ${renderGenres(genres.slice(0, 2))}`}
        </div>
        <div
          css={css`
            display: flex;
            justify-content: center;
            align-items: center;
            line-height: 1;
          `}
        >
          <StarIcon
            css={css`
              margin-right: 6px;
            `}
            width={12}
            height={12}
            fill="#fbffad"
          />
          <span
            css={css`
              font-size: 12px;
              font-weight: 300;
            `}
          >
            {rating}
          </span>
        </div>
      </div>
    </li>
  );
};

export default MovieItem;
