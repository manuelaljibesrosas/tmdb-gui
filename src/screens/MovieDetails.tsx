/** @jsx jsx */
import React, { useCallback, useEffect, useState } from 'react';
import { jsx, css } from '@emotion/react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'services/store';
// actions
import { movieDetails as movieDetailsActions } from 'services/resources/movieDetails/actions';
import StarIcon from 'assets/star-icon.svg';
// components
import Container from 'components/Container';
import SmallMoviePreview from 'components/SmallMoviePreview';
import CastMember from 'components/CastMember';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const movieDetails = useSelector((state: RootState) => state.movieDetails);

  const [showFullPlot, setShowFullPlot] = useState(false);

  useEffect(() => {
    dispatch(movieDetailsActions.request(parseInt(id)));
  }, [id]);

  const toggleShowFullPlot = useCallback(() => {
    setShowFullPlot(!showFullPlot);
  }, [setShowFullPlot, showFullPlot]);

  if (!movieDetails || movieDetails.id !== parseInt(id)) return null;

  const rating =
    (movieDetails.rating !== undefined || 0) && movieDetails.rating;

  const getStarColor = (minRating: number, rating: number) =>
    rating < minRating ? '#333' : '#fbffad';

  return (
    <Container
      css={css`
        position: relative;
      `}
    >
      <div
        css={css`
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 400px;
        `}
      >
        <img
          css={css`
            width: 100%;
            height: 100%;
            object-fit: cover;
          `}
          src={`https://image.tmdb.org/t/p/w500/${movieDetails.posterURL}`}
          alt="movie poster"
        />
        <div
          css={css`
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: linear-gradient(0deg, #111012, #ffffff00);
          `}
        />
        <div
          css={css`
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: radial-gradient(#86e41200, #00000030);
          `}
        />
      </div>
      <div
        css={css`
          position: relative;
          display: flex;
          flex-direction: column;
          padding-top: 240px;
        `}
      >
        <h3
          css={css`
            margin-bottom: 15px;
            font-size: 28px;
            line-height: 1.1;
            text-align: center;
          `}
        >
          {movieDetails.title}
        </h3>
        <div
          css={css`
            margin-bottom: 15px;
            display: flex;
            justify-content: center;
            line-height: 1;

            & > * {
              margin-right: 15px;
              font-weight: 300;
            }
            & > *:last-child {
              margin-right: 0;
            }
          `}
        >
          <div>
            {(movieDetails.releaseYear !== undefined || null) &&
              movieDetails.releaseYear}
          </div>
          <div>
            {(movieDetails.genres !== undefined || null) &&
              movieDetails.genres
                .slice(0, 2)
                .map(({ name }) => name)
                .join(', ')}
          </div>
          <div>
            {(movieDetails.runtime !== undefined || null) &&
              `${Math.floor(movieDetails.runtime / 60)}h ${
                movieDetails.runtime -
                Math.floor(movieDetails.runtime / 60) * 60
              }m`}
          </div>
        </div>
        <div
          css={css`
            margin-bottom: 25px;
            display: flex;
            justify-content: center;
            align-items: center;
          `}
        >
          <div
            css={css`
              margin-right: 10px;
              display: flex;
              justify-content: center;

              & > * {
                margin-right: 5px;
                font-weight: 300;
              }
              & > *:last-child {
                margin-right: 0;
              }
            `}
          >
            <StarIcon
              width={15}
              height={15}
              fill={getStarColor(0, rating)}
            ></StarIcon>
            <StarIcon
              width={15}
              height={15}
              fill={getStarColor(2, rating)}
            ></StarIcon>
            <StarIcon
              width={15}
              height={15}
              fill={getStarColor(4, rating)}
            ></StarIcon>
            <StarIcon
              width={15}
              height={15}
              fill={getStarColor(6, rating)}
            ></StarIcon>
            <StarIcon
              width={15}
              height={15}
              fill={getStarColor(8, rating)}
            ></StarIcon>
          </div>
          <div>{rating}</div>
        </div>
        <div
          css={css`
            margin-bottom: 40px;
            display: flex;
            flex-direction: column;
          `}
        >
          <h4
            css={css`
              margin-bottom: 12px;
              font-weight: 400;
            `}
          >
            Plot Summary
          </h4>
          <div
            css={css`
              margin-bottom: 8px;
              font-size: 14px;
              font-weight: 300;
              line-height: 1.5;
              color: #777;
            `}
          >
            {(movieDetails.overview !== undefined || null) &&
              movieDetails.overview
                .split(' ')
                .slice(0, showFullPlot ? Infinity : 15)
                .join(' ') + (showFullPlot ? '' : '...')}
          </div>
          <div
            css={css`
              font-size: 14px;
              color: #999;
            `}
            onClick={toggleShowFullPlot}
          >
            {showFullPlot ? 'Show less' : 'Read more'}
          </div>
        </div>
        <div
          css={css`
            margin-bottom: 40px;
            display: flex;
            flex-direction: column;
          `}
        >
          <h4
            css={css`
              margin-bottom: 12px;
              font-weight: 400;
            `}
          >
            Cast
          </h4>
          <div
            css={css`
              display: flex;
              align-items: flex-start;
            `}
          >
            {(movieDetails.credits?.cast !== undefined || null) &&
              movieDetails.credits.cast
                .slice(0, 4)
                .map(
                  (
                    { id, profile_path: profileURL, name, character },
                    index,
                  ) => (
                    <CastMember
                      key={id}
                      profileURL={profileURL}
                      name={name}
                      role={character}
                      isLastInList={index === 3}
                      remainingItems={movieDetails.credits.cast.length - 4}
                    />
                  ),
                )}
          </div>
        </div>
        <div
          css={css`
            margin-bottom: 35px;
            display: flex;
            flex-direction: column;
          `}
        >
          <h4
            css={css`
              margin-bottom: 12px;
              font-weight: 400;
            `}
          >
            Viewers Also Liked
          </h4>
          <div
            css={css`
              display: flex;
              flex-direction: column;
            `}
          >
            {(movieDetails.recommendations !== undefined || null) &&
              movieDetails.recommendations
                .slice(0, 3)
                .map(
                  ({
                    id,
                    title,
                    backdrop_path,
                    release_date,
                    vote_average,
                    genre_ids,
                  }) => (
                    <SmallMoviePreview
                      key={id}
                      id={id}
                      title={title}
                      posterURL={backdrop_path}
                      releaseDate={release_date}
                      rating={vote_average}
                      genres={genre_ids}
                    />
                  ),
                )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default MovieDetails;
