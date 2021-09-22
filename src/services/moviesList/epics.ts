import { combineEpics, Epic } from 'redux-observable';
import { Observable } from 'rxjs';
import { mapTo, filter } from 'rxjs/operators';
import { RootAction } from 'services/store';
import { movies } from 'services/resources/movies/actions';
import { updateFilters } from './actions';
import { isActionOf } from 'typesafe-actions';

export const dispatchFetchOnFiltersUpdateEpic: Epic<RootAction, RootAction> = (
  action$: Observable<RootAction>,
) => action$.pipe(filter(isActionOf(updateFilters)), mapTo(movies.request()));

export default combineEpics(dispatchFetchOnFiltersUpdateEpic);
