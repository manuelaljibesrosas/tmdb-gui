import { createReducer } from 'redux-create-reducer';
import { ActionType } from 'typesafe-actions';
import { NetworkStatus } from 'shared/network';
import * as movieActions from './actions';

export type Movie = {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: Array<number>;
};

export type Actions = ActionType<typeof movieActions>;

export type MoviesResponse = {
  page: number;
  results: Array<Movie>;
};

export type State = {
  readonly status: NetworkStatus;
  readonly lastResponse: MoviesResponse | null;
};

const initialState: State = {
  status: NetworkStatus.READY,
  lastResponse: null,
};

export default createReducer<State, Actions>(initialState, {
  [movieActions.REQUEST]: (state) => ({
    ...state,
    status: NetworkStatus.PENDING,
  }),
  [movieActions.SUCCESS]: (state, { payload: lastResponse }) => ({
    ...state,
    status: NetworkStatus.READY,
    lastResponse,
  }),
  [movieActions.FAILURE]: (state) => ({
    ...state,
    status: NetworkStatus.ERROR,
  }),
});
