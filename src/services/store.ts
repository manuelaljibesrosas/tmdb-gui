import { createStore, combineReducers, applyMiddleware } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { StateType, ActionType } from 'typesafe-actions';
import { ajax } from 'rxjs/ajax';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
// movie details service
import movieDetailsServiceReducer from './movieDetails/reducer';
import * as movieDetailsService from './movieDetails/actions';
import movieDetailsServiceEpic from './movieDetails/epics';
// movie list service
import moviesListReducer from './moviesList/reducer';
import * as moviesList from './moviesList/actions';
import moviesListEpic from './moviesList/epics';
// movies resource
import moviesReducer from './resources/movies/reducer';
import { movies } from './resources/movies/actions';
import moviesEpic from './resources/movies/epics';
// movie details resource
import movieDetailsReducer from './resources/movieDetails/reducer';
import { movieDetails } from './resources/movieDetails/actions';
import movieDetailsEpic from './resources/movieDetails/epics';

const rootReducer = combineReducers({
  moviesList: moviesListReducer,
  movieDetails: movieDetailsServiceReducer,
  resources: combineReducers({
    movies: moviesReducer,
    movieDetails: movieDetailsReducer,
  }),
});

const rootEpic = combineEpics(
  moviesListEpic,
  moviesEpic,
  movieDetailsEpic,
  movieDetailsServiceEpic,
);

export type RootState = StateType<typeof rootReducer>;
export type RootAction = ActionType<
  | typeof moviesList
  | typeof movies
  | typeof movieDetails
  | typeof movieDetailsService
>;

export type Dependencies = {
  getJSON: typeof ajax.getJSON;
};

const epicMiddleware = createEpicMiddleware<
  RootAction,
  RootAction,
  RootState,
  Dependencies
>({
  dependencies: { getJSON: ajax.getJSON },
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(epicMiddleware)),
);

epicMiddleware.run(rootEpic);

// kickstart the first request
store.dispatch(movies.request());

export default store;
