/** @jsx jsx */
import React, { useCallback, useMemo, useState, useRef } from 'react';
import { css, jsx } from '@emotion/react';
import { connect } from 'react-redux';
import { throttle } from 'throttle-debounce';
import { genres } from 'shared/constants';
import { Filters } from 'services/moviesList/reducer';
import { RootState } from 'services/store';
// actions
import { updateFilters } from 'services/moviesList/actions';
// components
import Multiselect from 'multiselect-react-dropdown';
import FormGroup from 'components/FormGroup';
import Button from 'components/Button';
import StarIcon from 'assets/star-icon.svg';

type Props = {
  updateFilters: (payload: Partial<Filters>) => void;
};

const SearchFilters: React.FC<Filters & Props> = ({
  selectedGenres,
  minimumRating,
  releaseYear,
  query,
  updateFilters,
}) => {
  const searchQueryInput = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showClearTextBtn, setShowClearTextBtn] = useState(false);
  const [state, setState] = useState({
    selectedGenres,
    minimumRating,
    releaseYear,
  });

  const handleSearchQuery = useCallback(
    throttle(1000, false, (e: React.ChangeEvent<HTMLInputElement>) => {
      const {
        target: { value: query },
      } = e;

      if (query.length > 0) setShowClearTextBtn(true);
      else setShowClearTextBtn(false);

      updateFilters({ query });
    }),
    [updateFilters, setShowClearTextBtn],
  );

  const clearSearchQuery = useCallback(() => {
    (searchQueryInput.current as HTMLInputElement).value = '';
    setShowClearTextBtn(false);
    updateFilters({ query: '' });
  }, [updateFilters, searchQueryInput, setShowClearTextBtn]);

  const handleGenreChange = useCallback(
    (selectedGenres) => {
      setState((s) => ({
        ...s,
        selectedGenres,
      }));
    },
    [setState],
  );

  const handleMinimumRatingChange = (minimumRating: number) => {
    setState((s) => ({
      ...s,
      minimumRating,
    }));
  };

  const handleReleaseYearChange = useCallback(
    (e) => {
      let {
        target: { value: releaseYear },
      } = e;

      if (releaseYear.length > 4) return;

      if (releaseYear.length === 4)
        releaseYear = Math.max(
          1888,
          Math.min(2021, parseInt(releaseYear)),
        ).toString();

      setState((s) => ({
        ...s,
        releaseYear,
      }));
    },
    [setState],
  );

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    // lock scroll
    window.document.body.style.overflow = 'hidden';
  }, [setIsModalOpen]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    // unlock scroll
    window.document.body.style.overflow = 'unset';
  }, [setIsModalOpen]);

  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const commitChanges = useCallback(() => {
    updateFilters(state);
    closeModal();
  }, [state, closeModal]);

  const discardChanges = useCallback(() => {
    // TODO: this deletes the changes in the state
    // solve this by breaking up this component, it's
    // too big in its current state
    setState({
      selectedGenres,
      minimumRating,
      releaseYear,
    });
    closeModal();
  }, [setState, closeModal]);

  const numberOfFiltersApplied = useMemo(() => {
    const didDefineGenres = selectedGenres.length > 0 ? 1 : 0;
    const didChangeMinRating = minimumRating !== 2 ? 1 : 0;
    const didChangeReleaseYear = releaseYear.length > 0 ? 1 : 0;

    return didDefineGenres + didChangeMinRating + didChangeReleaseYear;
  }, [selectedGenres, minimumRating, releaseYear]);

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        height: 60px;
      `}
    >
      <div
        css={css`
          position: relative;
          margin-right: 10px;
          width: 100%;
        `}
      >
        <input
          ref={searchQueryInput}
          css={css`
            width: 100%;
            height: 50px;
            padding: 0 50px 0 15px;
            border: none;
            outline: none;
            line-height: 50px;
            border-radius: 10px;
            background: #222;
          `}
          type="text"
          placeholder="Search..."
          onChange={handleSearchQuery}
          defaultValue={query}
        />
        {(showClearTextBtn || null) && (
          <div
            css={css`
              transform: translateY(-50%);
              position: absolute;
              top: 50%;
              right: 10px;
              width: 30px;
              height: 30px;
              display: flex;
              justify-content: center;
              align-items: center;
              background: #7171715e;
              border-radius: 50%;
            `}
            onClick={clearSearchQuery}
          >
            <svg width="8px" height="8px">
              <line
                strokeWidth="2px"
                stroke="#fff"
                strokeLinecap="round"
                x1="0"
                x2="8"
                y1="0"
                y2="8"
              />
              <line
                strokeWidth="2px"
                stroke="#fff"
                strokeLinecap="round"
                x1="8"
                x2="0"
                y1="0"
                y2="8"
              />
            </svg>
          </div>
        )}
      </div>
      <div
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          width: 35px;
        `}
      >
        <div
          css={css`
            position: relative;
          `}
          onClick={openModal}
        >
          {(numberOfFiltersApplied > 0 || null) && (
            <div
              css={css`
                transform: translate(17px, -10px);
                position: absolute;
                width: 20px;
                height: 20px;
                border: 3px solid #131215;
                text-align: center;
                line-height: 15px;
                font-size: 12px;
                background-color: #e91e63;
                background-image: linear-gradient(
                  45deg,
                  #ffc0cb45,
                  transparent
                );
                border-radius: 50%;
              `}
            >
              {numberOfFiltersApplied}
            </div>
          )}
          <svg width="28px" height="35px">
            <path
              fill="none"
              strokeWidth="2px"
              stroke="#fff"
              strokeLinecap="round"
              d="M 5,2.5  v 30  M 20,2.5 v 30"
            />
            <circle cx="5" cy="12" r="4" fill="#fff" />
            <circle cx="20" cy="24" r="4" fill="#fff" />
          </svg>
        </div>
        {isModalOpen && (
          <div
            css={css`
              z-index: 20;
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: #1b1b1b6b;
            `}
            onClick={discardChanges}
          >
            <div
              css={css`
                transform: translate(-50%, -50%);
                position: absolute;
                top: 50%;
                left: 50%;
                display: flex;
                flex-direction: column;
                width: 320px;
                max-width: calc(100% - 40px);
                max-height: calc(100% - 40px);
                background-color: #1b1b1b;
                background-image: linear-gradient(
                  45deg,
                  #141316ba 10%,
                  transparent 100%
                );
                border-radius: 12px;
              `}
              onClick={stopPropagation}
            >
              <div
                css={css`
                  padding: 20px 25px;
                  line-height: 1;
                  font-size: 22px;
                  font-weight: 600;
                `}
              >
                Filters
              </div>
              <div
                css={css`
                  padding: 0px 25px 20px;
                `}
              >
                <FormGroup name="Genres">
                  <Multiselect
                    options={genres}
                    displayValue="name"
                    closeIcon="cancel"
                    onSelect={handleGenreChange}
                    selectedValues={state.selectedGenres}
                    style={{
                      searchBox: {
                        border: '3px solid #313131',
                        borderRadius: '12px',
                      },
                      optionContainer: {
                        border: 'none',
                        borderRadius: '10px',
                        backgroundColor: '#333',
                      },
                      chips: {
                        backgroundColor: '#333',
                      },
                      option: {
                        fontSize: '13px',
                        backgroundColor: 'transparent',
                      },
                    }}
                  />
                </FormGroup>
                <FormGroup name="Minimum Rating">
                  <div
                    css={css`
                      display: flex;
                      justify-content: space-between;
                      align-items: flex-start;
                      width: 160px;
                      height: 32px;
                    `}
                  >
                    {new Array(5).fill(1).map((_, i) => (
                      <StarIcon
                        key={i}
                        index={i}
                        fill={state.minimumRating >= i ? '#fbffad' : '#333'}
                        width={20}
                        height={20}
                        // this anonymous function will trigger
                        // a re-render, there are ways to get around
                        // this issue (it's not by using useCallback btw)
                        // but given the negligible impact this has
                        // on performance for leaf components as this one
                        // we choose to use the anonymous function
                        onClick={() => handleMinimumRatingChange(i)}
                      />
                    ))}
                  </div>
                </FormGroup>
                <FormGroup name="Release Year">
                  <input
                    css={css`
                      height: 40px;
                      width: 100%;
                      padding: 0 8px;
                      border: 3px solid #313131;
                      background: transparent;
                      color: #d2d2d2;
                      border-radius: 12px;
                      font-size: 14px;

                      &:focus {
                        outline: none;
                      }
                    `}
                    type="number"
                    min="1925"
                    max="2021"
                    placeholder="Unspecified"
                    value={state.releaseYear}
                    onChange={handleReleaseYearChange}
                  />
                </FormGroup>
              </div>
              <div
                css={css`
                  display: flex;
                  justify-content: space-between;
                  padding: 15px 25px 20px;
                `}
              >
                <Button onClick={discardChanges}>Cancel</Button>
                <Button filled onClick={commitChanges}>
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default connect((state: RootState) => state.moviesList.filters, {
  updateFilters,
})(SearchFilters);
