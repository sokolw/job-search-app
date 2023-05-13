import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { MainPage } from './pages/main-page';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { Header } from './components/header';
import { FavoritesPage } from './pages/favorites-page';
import { VacancyPage } from './pages/vacancy-page';
import { FAVORITES, VACANCY } from './common/routes';
import { vacancyPageLoader } from './pages/vacancy-page/vacancy-page';

const router = createBrowserRouter([
  {
    element: (
      <>
        <Header></Header>
        <Outlet></Outlet>
      </>
    ),
    errorElement: (
      <p>
        Упс. 404 такой страницы нет. <a href='/'>Перейти на главную</a>
      </p>
    ),
    children: [
      {
        path: '/',
        element: <MainPage />,
      },
      {
        path: `${VACANCY}/:id`,
        element: <VacancyPage />,
        loader: vacancyPageLoader,
      },
      {
        path: `${FAVORITES}`,
        element: <FavoritesPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
