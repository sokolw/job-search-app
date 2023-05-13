import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CatalogIndustriesResponse } from '../common/types/catalog-industries-response';
import { superjobApi } from '../api/superjob-api';
import { RootState } from './store';
import { AxiosError } from 'axios';
import { RETRIES } from './constants';

const CATALOGUES_DATA_KEY = 'CATALOGUES_DATA';
const DAY_IN_MS = 86400000;

type CataloguesLocalStoreType = {
  data: CatalogIndustriesResponse;
  receiveTimestampUTC: string;
};

export interface CataloguesState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  numberOfRetries: number;
  error: string | null | undefined;
  receiveTimestampUTC: string;
  daysToNextUpdate: number;
  data: CatalogIndustriesResponse;
}

const initState = (): CataloguesState => {
  const initialState: CataloguesState = {
    status: 'idle',
    numberOfRetries: RETRIES,
    error: null,
    receiveTimestampUTC: '',
    daysToNextUpdate: DAY_IN_MS,
    data: [],
  };

  // ERR_TOO_MANY_REDIRECTS 302, save in localStorage and update after 1 day
  const data = localStorage.getItem(CATALOGUES_DATA_KEY);
  try {
    if (data) {
      const parsedData = JSON.parse(data) as CataloguesLocalStoreType;
      const currUTCDate = Date.parse(new Date().toUTCString());
      const oldUTCDate = Date.parse(parsedData.receiveTimestampUTC);
      if (currUTCDate - oldUTCDate < initialState.daysToNextUpdate) {
        initialState.data = parsedData.data;
        initialState.receiveTimestampUTC = parsedData.receiveTimestampUTC;
        initialState.status = 'succeeded';
      }
    }
  } catch {
    localStorage.removeItem(CATALOGUES_DATA_KEY);
  }
  return initialState;
};

export const getCataloguesData = createAsyncThunk(
  'getCataloguesData',
  async (_arg, { getState, rejectWithValue, dispatch }) => {
    const state = getState() as RootState;
    try {
      const response = await superjobApi.getCatalogues();
      return response.data as unknown as CatalogIndustriesResponse;
    } catch (error) {
      const err = error as AxiosError;
      if (!err.response) {
        throw error;
      }
      const { response } = err;

      if ((response.status >= 300 && response.status < 400) || response.status >= 500) {
        const numberOfRetries = selectNumberOfRetries(state);
        if (numberOfRetries > 0) {
          dispatch(setNumberOfRetries(numberOfRetries - 1));
          dispatch(getCataloguesData());
          return null;
        }
      }

      return rejectWithValue(err.response.data);
    }
  }
);

const cataloguesSlice = createSlice({
  name: 'catalogues',
  initialState: initState(),
  reducers: {
    setNumberOfRetries: (state, action: PayloadAction<number>) => {
      state.numberOfRetries = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getCataloguesData.pending, (state, _action) => {
        state.status = 'loading';
      })
      .addCase(getCataloguesData.fulfilled, (state, action) => {
        if (action.payload) {
          const currDate = new Date().toUTCString();
          localStorage.setItem(
            CATALOGUES_DATA_KEY,
            JSON.stringify({ data: action.payload, receiveTimestampUTC: currDate } as CataloguesLocalStoreType)
          );
          state.data = action.payload;
          state.receiveTimestampUTC = currDate;
          state.numberOfRetries = RETRIES;
          state.status = 'succeeded';
        }
      })
      .addCase(getCataloguesData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const cataloguesReducer = cataloguesSlice.reducer;
export const { setNumberOfRetries } = cataloguesSlice.actions;
// selectors
export const selectCataloguesStatus = (state: RootState): string => state.catalogues.status;
export const selectCatalogues = (state: RootState): CatalogIndustriesResponse => state.catalogues.data;
export const selectNumberOfRetries = (state: RootState): number => state.catalogues.numberOfRetries;
