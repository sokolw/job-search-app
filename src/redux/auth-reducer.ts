import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';
import { AuthResponse } from '../common/types/auth-response';
import { superjobApi } from '../api/superjob-api';
import { RETRIES } from './constants';
import { AxiosError } from 'axios';

const AUTH_DATA_KEY = 'AUTH_DATA';

export interface AuthState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  numberOfRetries: number;
  error: string | null | undefined;
  data: AuthResponse;
}

const initState = (): AuthState => {
  const initialState: AuthState = {
    status: 'idle',
    numberOfRetries: RETRIES,
    error: null,
    data: {
      access_token: '',
      refresh_token: '',
      ttl: 0,
      expires_in: 0,
      token_type: '',
      reg_user_resumes_count: 0,
    },
  };

  const data = localStorage.getItem(AUTH_DATA_KEY);
  try {
    if (data) {
      initialState.data = JSON.parse(data) as AuthResponse;
      initialState.status = 'succeeded';
    }
  } catch {
    localStorage.removeItem(AUTH_DATA_KEY);
  }
  return initialState;
};

export const getAuthData = createAsyncThunk('getAuthData', async (arg, { getState, rejectWithValue, dispatch }) => {
  const state = getState() as RootState;
  try {
    const response = await superjobApi.auth();
    return response.data as unknown as AuthResponse;
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
        dispatch(getAuthData());
        return null;
      }
    }

    return rejectWithValue(err.response.data);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: initState(),
  reducers: {
    setNumberOfRetries: (state, action: PayloadAction<number>) => {
      state.numberOfRetries = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAuthData.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getAuthData.fulfilled, (state, action) => {
        if (action.payload) {
          localStorage.setItem(AUTH_DATA_KEY, JSON.stringify(action.payload));
          state.data = action.payload;
          state.numberOfRetries = RETRIES;
          state.status = 'succeeded';
        }
      })
      .addCase(getAuthData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const authReducer = authSlice.reducer;
export const { setNumberOfRetries } = authSlice.actions;
// selectors
export const selectAuthStatus = (state: RootState): string => state.auth.status;
export const selectNumberOfRetries = (state: RootState): number => state.auth.numberOfRetries;
