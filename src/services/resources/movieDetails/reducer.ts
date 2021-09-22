import { createReducer } from 'redux-create-reducer';
import { ActionType } from 'typesafe-actions';
import { NetworkStatus } from 'shared/network';
import * as movieDetailsActions from './actions';
import { Genre } from 'services/moviesList/reducer';
import { Movie } from 'services/resources/movies/reducer';

type CastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string;
};

export type MovieDetailsResponse = {
  genres: Array<Genre>;
  id: number;
  poster_path: string;
  title: string;
  vote_average: number;
  release_date: string;
  runtime: number;
  overview: string;
  credits: {
    cast: Array<CastMember>;
  };
  recommendations: {
    results: Array<Movie>;
  };
};

export type State = {
  readonly status: NetworkStatus;
  readonly lastResponse: MovieDetailsResponse | null;
};

export type Actions = ActionType<typeof movieDetailsActions>;

const initialState: State = {
  status: NetworkStatus.READY,
  lastResponse: null,
};

export default createReducer<State, Actions>(initialState, {
  [movieDetailsActions.REQUEST]: (state) => ({
    ...state,
    status: NetworkStatus.PENDING,
  }),
  [movieDetailsActions.SUCCESS]: (state, { payload: lastResponse }) => ({
    ...state,
    status: NetworkStatus.READY,
    lastResponse,
  }),
  [movieDetailsActions.FAILURE]: (state) => ({
    ...state,
    status: NetworkStatus.ERROR,
  }),
});
