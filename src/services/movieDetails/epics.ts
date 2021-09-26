import { combineEpics, Epic } from 'redux-observable';
import { Observable } from 'rxjs';
import { map, filter, withLatestFrom } from 'rxjs/operators';
import { RootAction, RootState } from 'services/store';
import { movieDetails } from 'services/resources/movieDetails/actions';
import { updateMovieDetails } from './actions';
import { isActionOf } from 'typesafe-actions';
import { MovieDetailsResponse } from 'services/resources/movieDetails/reducer';

export const updateDetailslOnMoviesResourceSuccessEpic: Epic<
  RootAction,
  RootAction,
  RootState
> = (action$: Observable<RootAction>, state$: Observable<RootState>) =>
  action$.pipe(
    filter(isActionOf(movieDetails.success)),
    withLatestFrom(state$),
    map((value) => {
      const {
        resources: {
          movieDetails: { lastResponse },
        },
      } = value[1];
      const {
        genres,
        id,
        poster_path: posterURL,
        title,
        vote_average: rating,
        release_date,
        runtime,
        overview,
        credits: { cast },
        recommendations: { results: recommendations },
      } = lastResponse as MovieDetailsResponse;

      return updateMovieDetails({
        genres,
        id,
        posterURL,
        title,
        rating,
        releaseYear: release_date.split('-')[0],
        runtime,
        overview,
        credits: { cast },
        recommendations,
      });
    }),
  );

export default combineEpics(updateDetailslOnMoviesResourceSuccessEpic);
