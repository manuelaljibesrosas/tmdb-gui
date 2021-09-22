import { createAsyncAction } from 'typesafe-actions';
import { MovieDetailsResponse } from './reducer';

export const REQUEST = '@@tmdbui/resources/movieDetails/REQUEST';
export const SUCCESS = '@@tmdbui/resources/movieDetails/SUCCESS';
export const FAILURE = '@@tmdbui/resources/movieDetails/FAILURE';

export const movieDetails = createAsyncAction(REQUEST, SUCCESS, FAILURE)<
  number,
  MovieDetailsResponse,
  undefined
>();
