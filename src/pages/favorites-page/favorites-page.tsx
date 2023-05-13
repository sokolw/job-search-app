import { useEffect } from 'react';
import { VacancyListPagination } from '../../components/vacancy-list-pagination';
import {
  DEFAULT_ITEMS_PER_PAGE,
  getFavoriteVacanciesData,
  selectFavoriteVacancies,
  selectStatusFavoriteVacancies,
} from '../../redux/vacancies-reducer';
import styles from './favorites-page.module.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Status } from '../../redux/status.enum';
import { CustomText } from '../../components/custom-text';
import { ERR_RESOURCE_NOT_AVAILABLE } from '../../common/constants';
import { Spinner } from '../../components/spinner';
import { EmptyState } from '../../components/empty-state';

export const FavoritesPage = () => {
  const status = useAppSelector(selectStatusFavoriteVacancies);
  const favoriteVacancies = useAppSelector(selectFavoriteVacancies);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === Status.IDLE) {
      dispatch(getFavoriteVacanciesData());
    }
  }, [status]);

  const prepareDisplay = () => {
    if (status === Status.FAILED) {
      return <CustomText text={ERR_RESOURCE_NOT_AVAILABLE}></CustomText>;
    }
    if (status === Status.LOADING) {
      return <Spinner></Spinner>;
    }
    if (status === Status.SUCCEEDED && favoriteVacancies.length === 0) {
      return <EmptyState></EmptyState>;
    }
    return (
      <VacancyListPagination
        vacancies={favoriteVacancies}
        itemsPerPage={DEFAULT_ITEMS_PER_PAGE}
      ></VacancyListPagination>
    );
  };

  return <div className={styles.favoritesPage}>{prepareDisplay()}</div>;
};
