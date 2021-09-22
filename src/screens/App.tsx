/** @jsx jsx */
import React from 'react';
import { Global, jsx, css } from '@emotion/react';
import { history, routes } from 'shared/router';
import store from 'services/store';
import 'regenerator-runtime/runtime';
// components
import { Provider } from 'react-redux';
import { Router, Switch, Route } from 'react-router-dom';
import StatusBar from 'components/StatusBar';
import MoviesList from './MoviesList';
import MovieDetails from './MovieDetails';

const App: React.FC = () => (
  <React.StrictMode>
    <Global
      styles={css`
        * {
          box-sizing: border-box;
          user-select: none;
          margin: 0;
          color: #fff;
          font-family: Poppins, sans-serif;
          font-size: 14px;
        }
        .optionListContainer {
          background: transparent !important;
        }
      `}
    />
    <Provider store={store}>
      <Router history={history}>
        <main
          css={css`
            min-height: 100vh;
            width: 100%;
            background-image: linear-gradient(#101012, #141316, #080808);
          `}
        >
          <StatusBar />
          <Switch>
            <Route exact path={routes.MOVIES_LIST}>
              <MoviesList />
            </Route>
            <Route path={`${routes.MOVIE_DETAILS}/:id`}>
              <MovieDetails />
            </Route>
            <Route>
              <h1>No match</h1>
            </Route>
          </Switch>
        </main>
      </Router>
    </Provider>
  </React.StrictMode>
);

export default App;
