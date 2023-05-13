import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';
import { QueryVacancies } from '../api/superjob-api';

const DEFAULT_VALUE = 'Выберете отрасль';

export interface FilterState {
  keyword: string;
  catalogIndustryTitle: string;
  catalogIndustryKey: number;
  paymentFrom: number;
  paymentTo: number;
  validationErrors: string[];
  isSubmitted: boolean;
}

const initialState: FilterState = {
  keyword: '',
  catalogIndustryTitle: DEFAULT_VALUE,
  catalogIndustryKey: -1,
  paymentFrom: -1,
  paymentTo: -1,
  validationErrors: [],
  isSubmitted: false,
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setKeyword: (state, action: PayloadAction<string>) => {
      state.keyword = action.payload;
    },
    setCatalogIndustry: (state, action: PayloadAction<{ title: string; key: number }>) => {
      state.catalogIndustryTitle = action.payload.title;
      state.catalogIndustryKey = action.payload.key;
      state.isSubmitted = false;
    },
    setPaymentFrom: (state, action: PayloadAction<number>) => {
      state.paymentFrom = action.payload;
      state.isSubmitted = false;
    },
    setPaymentTo: (state, action: PayloadAction<number>) => {
      state.paymentTo = action.payload;
      state.isSubmitted = false;
    },
    resetWithoutKeyword: (state) => {
      state.catalogIndustryTitle = initialState.catalogIndustryTitle;
      state.catalogIndustryKey = initialState.catalogIndustryKey;
      state.paymentFrom = initialState.paymentFrom;
      state.paymentTo = initialState.paymentTo;
      state.isSubmitted = false;
    },
    setIsSubmitted: (state, action: PayloadAction<boolean>) => {
      state.isSubmitted = action.payload;
    },
    validateFilter: (state) => {
      state.validationErrors = [];
      const { paymentFrom, paymentTo } = state;
      if (paymentFrom > paymentTo) {
        state.validationErrors.push('Оклад До должен быть больше От!');
      }
      if (paymentTo > 0 && paymentFrom < 0) {
        state.validationErrors.push('Не указан оклад От!');
      }
      state.isSubmitted = state.validationErrors.length === 0;
    },
  },
});

export const filterReducer = filterSlice.reducer;
export const {
  setKeyword,
  setCatalogIndustry,
  setPaymentFrom,
  setPaymentTo,
  resetWithoutKeyword,
  validateFilter,
  setIsSubmitted,
} = filterSlice.actions;
// selectors
export const selectWithoutKeyword = (state: RootState): Omit<FilterState, 'keyword'> => {
  const { filter } = state;
  return {
    catalogIndustryKey: filter.catalogIndustryKey,
    catalogIndustryTitle: filter.catalogIndustryTitle,
    paymentFrom: filter.paymentFrom,
    paymentTo: filter.paymentTo,
    validationErrors: filter.validationErrors,
    isSubmitted: filter.isSubmitted,
  };
};
export const selectFilterQuery = (state: RootState): QueryVacancies => {
  const { filter } = state;
  return {
    page: 0,
    published: 1,
    keyword: initialState.keyword !== filter.keyword ? filter.keyword : undefined,
    payment_from:
      initialState.paymentFrom !== filter.paymentFrom && filter.validationErrors.length === 0
        ? filter.paymentFrom
        : undefined,
    payment_to:
      initialState.paymentTo !== filter.paymentTo && filter.validationErrors.length === 0
        ? filter.paymentTo
        : undefined,
    catalogues: initialState.catalogIndustryKey !== filter.catalogIndustryKey ? filter.catalogIndustryKey : undefined,
  };
};
export const selectKeyword = (state: RootState): string => state.filter.keyword;
