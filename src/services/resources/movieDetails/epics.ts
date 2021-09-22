import { combineEpics, Epic } from 'redux-observable';
import { Observable, of } from 'rxjs';
import { retry, switchMap, catchError, filter, map } from 'rxjs/operators';
import { Dependencies, RootState, RootAction } from 'services/store';
import { movieDetails } from './actions';
import { MovieDetailsResponse } from './reducer';
import { isActionOf } from 'typesafe-actions';

const API_KEY = '5de052dc3d6067d32ebccde3ec5ea7ad';

export const fetchMovieDetailsEpic: Epic<
  RootAction,
  RootAction,
  RootState,
  Dependencies
> = (action$: Observable<RootAction>, _, { getJSON }: Dependencies) =>
  action$.pipe(
    filter(isActionOf(movieDetails.request)),
    // fetch movies
    switchMap(({ payload: id }) =>
      getJSON<MovieDetailsResponse>(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=credits,recommendations`,
      ).pipe(retry(3)),
    ),
    // map to a Redux action
    map((response) => movieDetails.success(response)),
    catchError(() => of(movieDetails.failure())),
  );

export default combineEpics(fetchMovieDetailsEpic);
