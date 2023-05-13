import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { QueryVacancies, formattingQueryGetByIds, superjobApi } from '../api/superjob-api';
import { Vacancy, VacancyResponse } from '../common/types/vacancy-response';
import { RootState } from './store';
import { selectFilterQuery } from './filter-reducer';
import { AxiosError } from 'axios';
import { getAuthData } from './auth-reducer';
import { RETRIES } from './constants';
import { Status, StatusType } from './status.enum';

const VACANCIES_DATA_KEY = 'VACANCIES_DATA';
export const DEFAULT_ITEMS_PER_PAGE = 4;

export type CustomVacancy = Vacancy & { isFavorite: boolean };
type VacanciesLocalStoreType = { favoriteVacancyIds: number[] };

export interface VacanciesState {
  status: StatusType;
  numberOfRetries: number;
  error: string | null | undefined;
  data: CustomVacancy[];
  totalVacancies: number;
  favoriteVacancyIds: number[];
  statusFavoriteVacancies: StatusType;
  favoriteVacancies: CustomVacancy[];
  heapVacancies: CustomVacancy[];
  currentPage: number;
}

const initState = (): VacanciesState => {
  const initialState: VacanciesState = {
    status: Status.IDLE,
    numberOfRetries: RETRIES,
    error: null,
    data: [],
    totalVacancies: 0,
    favoriteVacancyIds: [],
    statusFavoriteVacancies: Status.IDLE,
    favoriteVacancies: [],
    heapVacancies: [],
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

export const getFavoriteVacanciesData = createAsyncThunk(
  'getFavoriteVacanciesData',
  async (_arg, { getState, rejectWithValue, dispatch }) => {
    const state = getState() as RootState;
    try {
      const vacancyIds = selectFavoriteVacancyIds(state);
      if (vacancyIds.length === 0) {
        return { objects: [] } as unknown as VacancyResponse;
      }
      const reqQuery = formattingQueryGetByIds(vacancyIds);

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
          dispatch(getFavoriteVacanciesData());
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
      const { id } = action.payload;
      const vacancy = state.data.find((item) => item.id === id);
      if (vacancy) {
        vacancy.isFavorite = true;
        state.favoriteVacancyIds.push(id);
        localStorage.setItem(
          VACANCIES_DATA_KEY,
          JSON.stringify({ favoriteVacancyIds: state.favoriteVacancyIds } as VacanciesLocalStoreType)
        );
        if (state.statusFavoriteVacancies === Status.SUCCEEDED) {
          state.favoriteVacancies.push(vacancy);
        }
      }
    },
    removeFromFavoriteVacancies: (state, action: PayloadAction<{ id: number }>) => {
      const { id } = action.payload;
      state.favoriteVacancyIds = state.favoriteVacancyIds.filter((favoriteId) => favoriteId !== id);
      state.favoriteVacancies = state.favoriteVacancies.filter((item) => {
        if (item.id !== id) {
          return true;
        }
        if (!state.heapVacancies.find((item) => item.id === id)) {
          state.heapVacancies.push(item);
        }
      });
      state.data = state.data.map((item) => (item.id !== id ? item : { ...item, isFavorite: false }));
      localStorage.setItem(
        VACANCIES_DATA_KEY,
        JSON.stringify({ favoriteVacancyIds: state.favoriteVacancyIds } as VacanciesLocalStoreType)
      );
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
      // getVacanciesData
      .addCase(getVacanciesData.pending, (state, _action) => {
        state.status = Status.LOADING;
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
          state.status = Status.SUCCEEDED;
        }
      })
      .addCase(getVacanciesData.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message;
      })
      // getFavoriteVacanciesData
      .addCase(getFavoriteVacanciesData.pending, (state, _action) => {
        state.statusFavoriteVacancies = Status.LOADING;
      })
      .addCase(getFavoriteVacanciesData.fulfilled, (state, action) => {
        if (action.payload) {
          const customVacancies: CustomVacancy[] = action.payload.objects.map((item) => ({
            ...item,
            isFavorite: true,
          }));
          state.favoriteVacancies = customVacancies;
          state.numberOfRetries = RETRIES;
          state.statusFavoriteVacancies = Status.SUCCEEDED;
        }
      })
      .addCase(getFavoriteVacanciesData.rejected, (state, action) => {
        state.statusFavoriteVacancies = Status.FAILED;
        state.error = action.error.message;
      });
  },
});

export const vacanciesReducer = vacanciesSlice.reducer;
export const { addToFavoriteVacancies, removeFromFavoriteVacancies, setCurrentPage, setNumberOfRetries } =
  vacanciesSlice.actions;
// selectors
export const selectVacanciesStatus = (state: RootState): string => state.vacancies.status;
export const selectVacancies = (state: RootState): CustomVacancy[] => state.vacancies.data;
export const selectTotalVacancies = (state: RootState): number => state.vacancies.totalVacancies;
export const selectCurrentPage = (state: RootState): number => state.vacancies.currentPage;
export const selectNumberOfRetries = (state: RootState): number => state.vacancies.numberOfRetries;
export const selectVacancyById = (id: number) => {
  return (state: RootState): CustomVacancy | undefined => {
    const findCallback = (item: CustomVacancy) => item.id === id;
    const fromData = state.vacancies.data.find(findCallback);
    if (fromData) {
      return fromData;
    }
    const fromFavorites = state.vacancies.favoriteVacancies.find(findCallback);
    if (fromFavorites) {
      return fromFavorites;
    }
    return state.vacancies.heapVacancies.find(findCallback);
  };
};
export const selectFavoriteVacancyIds = (state: RootState): number[] => state.vacancies.favoriteVacancyIds;
export const selectStatusFavoriteVacancies = (state: RootState): Status => state.vacancies.statusFavoriteVacancies;
export const selectFavoriteVacancies = (state: RootState): CustomVacancy[] => state.vacancies.favoriteVacancies;
