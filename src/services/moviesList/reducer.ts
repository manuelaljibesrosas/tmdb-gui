import { createReducer } from 'redux-create-reducer';
import { ActionType } from 'typesafe-actions';
import * as moviesListActions from './actions';

export type Movie = {
  id: number;
  title: string;
  posterURL: string;
  releaseYear: string;
  rating: number;
  genres: Array<number>;
  overview: string;
};

export type Genre = {
  id: number;
  name: string;
};

export type Filters = {
  selectedGenres: Array<Genre>;
  minimumRating: number;
  releaseYear: string;
  query: string;
};

export interface State {
  filters: Filters;
  movies: Array<Movie>;
  currentPage: number;
}

export type Actions = ActionType<typeof moviesListActions>;

const initialState: State = {
  filters: {
    // we use the AND operator to validate
    // that a movie meets the criteria defined
    // by the genres array, meaning that a
    // movie has to possess all of the genres
    // in the array and not just one of them
    selectedGenres: [],
    minimumRating: 2,
    releaseYear: '',
    query: '',
  },
  movies: [],
  currentPage: 1,
};

export default createReducer<State, Actions>(initialState, {
  [moviesListActions.PUSH]: (state, { payload: movies }) => ({
    ...state,
    movies: state.movies.concat(movies),
    currentPage: state.currentPage + 1,
  }),
  [moviesListActions.UPDATE_FILTERS]: (state, { payload: filters }) => ({
    filters: {
      ...state.filters,
      ...filters,
    },
    // reset the page pointer and discard
    // previous results if the filters change
    movies: [],
    currentPage: 1,
  }),
});
