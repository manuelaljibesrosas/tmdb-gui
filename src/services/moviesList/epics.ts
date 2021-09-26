import { combineEpics, Epic } from 'redux-observable';
import { Observable } from 'rxjs';
import { mapTo, map, filter, withLatestFrom } from 'rxjs/operators';
import { RootAction, RootState } from 'services/store';
import { movies } from 'services/resources/movies/actions';
import { push } from './actions';
import { updateFilters } from './actions';
import { isActionOf } from 'typesafe-actions';
import { MoviesResponse } from 'services/resources/movies/reducer';

export const dispatchFetchOnFiltersUpdateEpic: Epic<RootAction, RootAction> = (
  action$: Observable<RootAction>,
) => action$.pipe(filter(isActionOf(updateFilters)), mapTo(movies.request()));

export const updateListOnMoviesResourceSuccessEpic: Epic<
  RootAction,
  RootAction,
  RootState
> = (action$: Observable<RootAction>, state$: Observable<RootState>) =>
  action$.pipe(
    filter(isActionOf(movies.success)),
    withLatestFrom(state$),
    map((value) => {
      const {
        resources: {
          movies: { lastResponse },
        },
      } = value[1];

      // extract the properties that we care about and filter out
      // movies that don't have a poster
      const qs = (lastResponse as MoviesResponse).results
        .map(
          ({
            id,
            title,
            poster_path: posterURL,
            vote_average: rating,
            release_date: releaseDate,
            genre_ids: genres,
            overview,
          }) => ({
            id,
            title,
            posterURL,
            rating,
            // release date comes in the format
            // YYYY-MM-DD, extract the year
            releaseYear: releaseDate.split('-')[0],
            genres,
            overview,
          }),
        )
        .filter(({ posterURL }) => posterURL !== null);

      return push(qs);
    }),
  );

export default combineEpics(
  dispatchFetchOnFiltersUpdateEpic,
  updateListOnMoviesResourceSuccessEpic,
);
