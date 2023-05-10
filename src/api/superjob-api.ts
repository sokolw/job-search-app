import axios, { AxiosResponse } from 'axios';
import { ApiRoutes, PROXY_SERVER_KEY, URL_API_PROXY } from './constants';
import { AuthResponse } from '../common/types/auth-response';
import { VacancyResponse } from '../common/types/vacancy-response';
import { CatalogIndustriesResponse } from '../common/types/catalog-industries-response';

const userAuthCredentials = {
  login: 'sergei.stralenia@gmail.com',
  password: 'paralect123',
  client_id: 2356,
  client_secret: 'v3.r.137440105.ffdbab114f92b821eac4e21f485343924a773131.06c3bdbb8446aeb91c35b80c42ff69eb9c457948',
  hr: 0,
};

const instance = axios.create({
  baseURL: URL_API_PROXY,
  headers: {
    'x-secret-key': PROXY_SERVER_KEY,
  },
});

instance.interceptors.request.use(
  (request) => {
    if (request.url === ApiRoutes.VACANCIES) {
      request.headers['X-Api-App-Id'] = userAuthCredentials.client_secret;
    }
    return request;
  },
  (error) => {
    console.log(error);
  }
);

export type QueryVacancies = {
  page?: number;
  count?: number;
  published?: number;
  keyword?: string;
  payment_from?: number;
  payment_to?: number;
  catalogues?: number;
};

export const superjobApi = {
  auth() {
    return instance.get<AxiosResponse<AuthResponse>>(ApiRoutes.OAUTH2_PASSWORD, { params: userAuthCredentials });
  },
  getVacancies(query?: QueryVacancies, headers?: object) {
    return instance.get<AxiosResponse<VacancyResponse>>(ApiRoutes.VACANCIES, {
      params: query || {},
      headers: headers || {},
    });
  },
  getCatalogues() {
    return instance.get<AxiosResponse<CatalogIndustriesResponse>>(ApiRoutes.CATALOGUES);
  },
};
