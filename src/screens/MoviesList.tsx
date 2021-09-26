/** @jsx jsx */
import React, { useCallback, useState } from 'react';
import { connect, useStore } from 'react-redux';
import { jsx, css } from '@emotion/react';
import { NetworkStatus } from 'shared/network';
import { RootState } from 'services/store';
// actions
import { movies } from 'services/resources/movies/actions';
// components
import Container from 'components/Container';
import {
  AutoSizer,
  InfiniteLoader,
  Grid,
  WindowScroller,
} from 'react-virtualized';
import MovieItem from 'components/MovieItem';
import SearchFilters from 'components/SearchFilters';
import { Movie } from 'services/moviesList/reducer';

type Props = {
  moviesResourceStatus: NetworkStatus;
  movies: Array<Movie>;
  request: typeof movies.request;
};

const MoviesList: React.FC<Props> = ({
  moviesResourceStatus,
  movies,
  request,
}) => {
  const [columnWidth, setColumnWidth] = useState(100);
  const [shouldDisplayBackToTopBtn, setShouldDisplayBackToTopBtn] =
    useState(false);
  const store = useStore();

  const scrollToTop = useCallback(() => {
    window.scrollTo(0, 0);
  }, []);

  const isRowLoaded = useCallback(
    ({ index }) => movies[index * 2] !== undefined,
    [movies],
  );

  const loadMoreRows = useCallback(() => {
    if (moviesResourceStatus === NetworkStatus.PENDING)
      return Promise.resolve();

    request();

    // we need to return a promise that resolves once the request
    // for more data is fulfilled. Given that we're handling
    // network requests through Redux we need to subscribe to the
    // store here to monitor the request state
    return new Promise<void>((resolve) => {
      const unsubscribe = store.subscribe(() => {
        const state = store.getState();

        if (state.resources.movies.status === NetworkStatus.READY) {
          resolve();
          unsubscribe();
        }
      });
    });
  }, [moviesResourceStatus, request, store]);

  const updateColumnWidth = useCallback(
    ({ width }) => {
      setColumnWidth((width - 30) / 2);
    },
    [setColumnWidth],
  );

  const GridCell = useCallback(
    ({ columnIndex, key, rowIndex, style }) => {
      const movie = movies[rowIndex * 2 + columnIndex];

      if (movie === undefined) return null;

      return (
        <div style={style} key={key}>
          <MovieItem {...movie} />
        </div>
      );
    },
    [movies],
  );

  const _infiniteLoaderChildRenderer = useCallback(
    ({ onRowsRendered, registerChild }) => {
      const onSectionRendered = ({
        columnStartIndex,
        columnStopIndex,
        rowStartIndex,
        rowStopIndex,
      }: {
        columnStartIndex: number;
        columnStopIndex: number;
        rowStartIndex: number;
        rowStopIndex: number;
      }) => {
        const columnCount = 2;
        const startIndex = rowStartIndex * columnCount + columnStartIndex;
        const stopIndex = rowStopIndex * columnCount + columnStopIndex;

        onRowsRendered({
          startIndex,
          stopIndex,
        });
      };

      const handleScroll = ({ scrollTop }: { scrollTop: number }) => {
        const scrollThreshold = 2800;
        const hasScrolledPassedThreshold = scrollThreshold < scrollTop;

        if (hasScrolledPassedThreshold) setShouldDisplayBackToTopBtn(true);
        else setShouldDisplayBackToTopBtn(false);
      };

      return (
        <WindowScroller>
          {({ height, isScrolling, onChildScroll, scrollTop }) => (
            <AutoSizer disableHeight onResize={updateColumnWidth}>
              {({ width }) => (
                <Grid
                  // infinite loader props
                  ref={registerChild}
                  onSectionRendered={onSectionRendered}
                  // window scroller props
                  autoHeight
                  height={height}
                  isScrolling={isScrolling}
                  onScroll={(data) => {
                    handleScroll(data);
                    onChildScroll(data);
                  }}
                  scrollTop={scrollTop}
                  // grid props
                  columnCount={2}
                  columnWidth={columnWidth}
                  rowHeight={300}
                  rowCount={Math.floor(movies.length / 2) || 0}
                  width={width}
                  cellRenderer={GridCell}
                />
              )}
            </AutoSizer>
          )}
        </WindowScroller>
      );
    },
    [GridCell, columnWidth, updateColumnWidth],
  );

  return (
    <Container
      css={css`
        padding-top: 85px;
      `}
    >
      <div
        css={css`
          height: 120px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        `}
      >
        <h2
          css={css`
            margin-bottom: 10px;
            font-size: 30px;
          `}
        >
          Explore
        </h2>
        <div
          css={css`
            color: gray;
          `}
        >
          {"Let's find your favorite movie"}
        </div>
      </div>
      <div
        css={css`
          margin-bottom: 10px;
        `}
      >
        <SearchFilters />
      </div>
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={loadMoreRows}
        rowCount={Infinity}
        threshold={5}
      >
        {_infiniteLoaderChildRenderer}
      </InfiniteLoader>
      {(shouldDisplayBackToTopBtn || null) && (
        <div
          css={css`
            cursor: pointer;
            position: fixed;
            right: 15px;
            bottom: 15px;
            width: 50px;
            height: 50px;
            background-color: #2b2b2f;
            border-radius: 50%;
          `}
          onClick={scrollToTop}
        >
          <svg
            css={css`
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) translateY(-2px) scale(0.75);
            `}
            width="25px"
            height="15px"
          >
            <path
              strokeWidth="2px"
              stroke="#fff"
              strokeLinecap="round"
              fill="transparent"
              d="
                  M 0,15
                  l 12.5, -12
                  l 12.5, 12
                "
            />
          </svg>
        </div>
      )}
    </Container>
  );
};

export default connect(
  (state: RootState) => ({
    moviesResourceStatus: state.resources.movies.status,
    movies: state.moviesList.movies,
  }),
  movies,
)(MoviesList);
