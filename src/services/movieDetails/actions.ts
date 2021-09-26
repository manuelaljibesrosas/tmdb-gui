import { createAction } from 'typesafe-actions';
import { MovieDetails } from './reducer';

export const UPDATE = '@@tmdui/movieDetails/UPDATE';

export const updateMovieDetails = createAction(UPDATE)<Partial<MovieDetails>>();
