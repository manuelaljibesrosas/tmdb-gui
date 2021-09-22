import { createAction } from 'typesafe-actions';
import { Movie, Filters } from './reducer';

export const PUSH = '@@tmdui/moviesList/PUSH';
export const UPDATE_FILTERS = '@@tmdui/moviesList/UPDATE_FILTERS';

export const push = createAction(PUSH)<Array<Movie>>();
export const updateFilters = createAction(UPDATE_FILTERS)<Partial<Filters>>();
