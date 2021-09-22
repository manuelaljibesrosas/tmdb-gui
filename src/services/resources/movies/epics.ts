import { combineEpics, Epic } from 'redux-observable';
import { Observable, of, from } from 'rxjs';
import {
  mergeMap,
  map,
  retry,
  switchMap,
  catchError,
  withLatestFrom,
  filter,
} from 'rxjs/operators';
import { Dependencies, RootState, RootAction } from 'services/store';
import * as moviesList from 'services/moviesList/actions';
import { movies } from './actions';
import { isActionOf } from 'typesafe-actions';
import { MoviesResponse } from './reducer';

const API_KEY = '5de052dc3d6067d32ebccde3ec5ea7ad';

export const fetchMoviesEpic: Epic<
  RootAction,
  RootAction,
  RootState,
  Dependencies
> = (
  action$: Observable<RootAction>,
  state$: Observable<RootState>,
  { getJSON }: Dependencies,
) =>
  action$.pipe(
    filter(isActionOf(movies.request)),
    // fetch movies
    withLatestFrom(state$),
    switchMap((value) => {
      const state = value[1];
      const {
        filters: {
          query,
          selectedGenres,
          minimumRating: originalMinRating,
          releaseYear,
        },
        currentPage,
      } = state.moviesList;
      const genres = selectedGenres.map(({ id }) => id);
      // rating r on TMDb is 1 <= r <= 10
      // therefore, we double this value
      // to get the following possibilities:
      // { 0, 2, 4, 6, 8 }
      const minimumRating = originalMinRating * 2;

      if (query.length > 0)
        // use text search endpoint
        return getJSON<MoviesResponse>(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}` +
            `&query=${query}` +
            `&page=${currentPage}`,
        ).pipe(
          retry(3),
          map((response) => ({
            ...response,
            // we need to apply the filters in the client
            // because the text search API doesn't support them
            results: response.results.filter((mov) => {
              if (mov.vote_average < minimumRating) return false;
              if (!mov.release_date.includes(releaseYear)) return false;
              if (genres.length !== 0) {
                // we use the traditional for loop because it allows us to
                // short circuit the traversal if we find that one of the
                // selected genres isn't included in the movie's genres
                for (let i = 0; i < genres.length; i++) {
                  if (!mov.genre_ids.includes(genres[i])) return false;
                }
              }
              return true;
            }),
          })),
        );
      // use discover endpoint
      else
        return getJSON<MoviesResponse>(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}` +
            (genres.length > 0 ? `&with_genres=${genres.join(',')}` : '') +
            `&vote_average.gte=${minimumRating}` +
            (releaseYear.length === 4
              ? `&primary_release_year=${releaseYear}`
              : '') +
            `&page=${currentPage}`,
        ).pipe(
          // retry three times, change status to error if we can't get a response
          retry(3),
        );
    }),
    // map to a Redux action sequence
    mergeMap((response) => {
      // extract the properties that we care about and filter out
      // movies that don't have a poster
      const qs = response.results
        .map(
          ({
            id,
            title,
            poster_path: posterURL,
            vote_average: rating,
            release_date: releaseDate,
            genre_ids: genres,
          }) => ({
            id,
            title,
            posterURL,
            rating,
            // release date comes in the format
            // YYYY-MM-DD, extract the year
            releaseYear: releaseDate.split('-')[0],
            genres,
          }),
        )
        .filter(({ posterURL }) => posterURL !== null);

      return from([
        // TODO: store this results in the resource state
        // have an epic in the moviesList service that
        // listens for the SUCCESS action and reads the
        // state of this resource
        moviesList.push(qs),
        // signal success
        movies.success(response),
      ]);
    }),
    catchError(() => of(movies.failure())),
  );

export default combineEpics(fetchMoviesEpic);
