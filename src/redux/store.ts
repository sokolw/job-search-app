import { authReducer } from './auth-reducer';
import { configureStore } from '@reduxjs/toolkit';
import { filterReducer } from './filter-reducer';
import { cataloguesReducer } from './catalogues-reducer';
import { vacanciesReducer } from './vacancies-reducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    filter: filterReducer,
    catalogues: cataloguesReducer,
    vacancies: vacanciesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
