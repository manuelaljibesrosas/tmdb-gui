import { createAsyncAction } from 'typesafe-actions';
import { MoviesResponse } from './reducer';

export const REQUEST = '@@tmdbui/resources/movies/REQUEST';
export const SUCCESS = '@@tmdbui/resources/movies/SUCCESS';
export const FAILURE = '@@tmdbui/resources/movies/FAILURE';

export const movies = createAsyncAction(REQUEST, SUCCESS, FAILURE)<
  undefined,
  MoviesResponse,
  undefined
>();
