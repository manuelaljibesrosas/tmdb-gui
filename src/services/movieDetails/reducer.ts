import { createReducer } from 'redux-create-reducer';
import { ActionType } from 'typesafe-actions';
import * as movieDetailsActions from './actions';
import { Genre } from 'services/moviesList/reducer';
import { Movie } from 'services/resources/movies/reducer';
import { CastMember } from 'services/resources/movieDetails/reducer';

export type Actions = ActionType<typeof movieDetailsActions>;
export type MovieDetails = {
  genres: Array<Genre>;
  id: number;
  posterURL: string;
  title: string;
  rating: number;
  releaseYear: string;
  runtime: number;
  overview: string;
  credits: {
    cast: Array<CastMember>;
  };
  recommendations: Array<Movie>;
};

const initialState: MovieDetails = {
  genres: [],
  id: -Infinity,
  posterURL: '',
  title: '',
  rating: -Infinity,
  releaseYear: '',
  runtime: 0,
  overview: '',
  credits: {
    cast: [],
  },
  recommendations: [],
};

export default createReducer<MovieDetails, Actions>(initialState, {
  [movieDetailsActions.UPDATE]: (_, { payload: movieDetails }) => ({
    ...initialState,
    ...movieDetails,
  }),
});
