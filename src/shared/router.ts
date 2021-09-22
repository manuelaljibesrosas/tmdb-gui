import { createBrowserHistory } from 'history';

export enum routes {
  MOVIES_LIST = '/',
  MOVIE_DETAILS = '/details',
}

export const history = createBrowserHistory();
