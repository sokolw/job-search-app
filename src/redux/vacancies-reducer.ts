import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { QueryVacancies, superjobApi } from '../api/superjob-api';
import { Vacancy, VacancyResponse } from '../common/types/vacancy-response';
import { RootState } from './store';
import { selectFilterQuery } from './filter-reducer';
import { AxiosError } from 'axios';
import { getAuthData } from './auth-reducer';
import { RETRIES } from './constants';

const VACANCIES_DATA_KEY = 'VACANCIES_DATA';
export const DEFAULT_ITEMS_PER_PAGE = 4;

export type CustomVacancy = Vacancy & { isFavorite: boolean };
type VacanciesLocalStoreType = { favoriteVacancyIds: number[] };

export interface VacanciesState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  numberOfRetries: number;
  error: string | null | undefined;
  data: CustomVacancy[];
  totalVacancies: number;
  favoriteVacancyIds: number[];
  currentPage: number;
}

const initState = (): VacanciesState => {
  const initialState: VacanciesState = {
    status: 'idle',
    numberOfRetries: RETRIES,
    error: null,
    data: [],
    totalVacancies: 0,
    favoriteVacancyIds: [],
    currentPage: -1,
  };
  const data = localStorage.getItem(VACANCIES_DATA_KEY);
  try {
    if (data) {
      const parsedData = JSON.parse(data) as VacanciesLocalStoreType;
      initialState.favoriteVacancyIds = parsedData.favoriteVacancyIds;
    }
  } catch {
    localStorage.removeItem(VACANCIES_DATA_KEY);
  }
  return initialState;
};

export const getVacanciesData = createAsyncThunk(
  'getVacanciesData',
  async (query: QueryVacancies, { getState, rejectWithValue, dispatch }) => {
    const state = getState() as RootState;
    try {
      const filterQuery = selectFilterQuery(state);
      const reqQuery = { ...filterQuery, ...query, count: DEFAULT_ITEMS_PER_PAGE };
      dispatch(setCurrentPage(reqQuery.page ?? 0));

      const response = await superjobApi.getVacancies(reqQuery, {
        Authorization: `Bearer ${state.auth.data.access_token}`,
      });
      return response.data as unknown as VacancyResponse;
    } catch (error) {
      const err = error as AxiosError;
      if (!err.response) {
        throw error;
      }
      const { response } = err;

      if (response.status >= 400 && response.status < 500) {
        dispatch(getAuthData());
        return rejectWithValue(err.response.data);
      }

      if ((response.status >= 300 && response.status < 400) || response.status >= 500) {
        const numberOfRetries = selectNumberOfRetries(state);
        if (numberOfRetries > 0) {
          dispatch(setNumberOfRetries(numberOfRetries - 1));
          dispatch(getVacanciesData({}));
          return null;
        }
      }

      return rejectWithValue(err.response.data);
    }
  }
);

const vacanciesSlice = createSlice({
  name: 'vacancies',
  initialState: initState(),
  reducers: {
    addToFavoriteVacancies: (state, action: PayloadAction<{ id: number }>) => {
      state.favoriteVacancyIds.push(action.payload.id);
      localStorage.setItem(
        VACANCIES_DATA_KEY,
        JSON.stringify({ favoriteVacancyIds: state.favoriteVacancyIds } as VacanciesLocalStoreType)
      );
    },
    removeFromFavoriteVacancies: (state, action: PayloadAction<{ id: number }>) => {
      state.favoriteVacancyIds = state.favoriteVacancyIds.filter((id) => id !== action.payload.id);
      localStorage.setItem(
        VACANCIES_DATA_KEY,
        JSON.stringify({ favoriteVacancyIds: state.favoriteVacancyIds } as VacanciesLocalStoreType)
      );
    },
    setStatusManual: (state, action: PayloadAction<Pick<VacanciesState, 'status'>>) => {
      state.status = action.payload.status;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setNumberOfRetries: (state, action: PayloadAction<number>) => {
      state.numberOfRetries = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getVacanciesData.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getVacanciesData.fulfilled, (state, action) => {
        if (action.payload) {
          const customVacancies: CustomVacancy[] = action.payload.objects.map((item) => ({
            ...item,
            isFavorite: state.favoriteVacancyIds.includes(item.id),
          }));
          state.data = customVacancies;
          state.totalVacancies = action.payload.total;
          state.numberOfRetries = RETRIES;
          state.status = 'succeeded';
        }
      })
      .addCase(getVacanciesData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const vacanciesReducer = vacanciesSlice.reducer;
export const {
  addToFavoriteVacancies,
  removeFromFavoriteVacancies,
  setStatusManual,
  setCurrentPage,
  setNumberOfRetries,
} = vacanciesSlice.actions;
// selectors
export const selectVacanciesStatus = (state: RootState): string => state.vacancies.status;
export const selectVacancies = (state: RootState): CustomVacancy[] => state.vacancies.data;
export const selectTotalVacancies = (state: RootState): number => state.vacancies.totalVacancies;
export const selectCurrentPage = (state: RootState): number => state.vacancies.currentPage;
export const selectNumberOfRetries = (state: RootState): number => state.vacancies.numberOfRetries;
