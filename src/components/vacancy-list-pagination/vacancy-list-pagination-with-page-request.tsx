import styles from './vacancy-list-pagination.module.css';
import { VacancyList } from '../vacancy-list';
import { useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import {
  DEFAULT_ITEMS_PER_PAGE,
  getVacanciesData,
  selectCurrentPage,
  selectTotalVacancies,
  selectVacancies,
  selectVacanciesStatus,
} from '../../redux/vacancies-reducer';
import { useAppSelector } from '../../redux/hooks';
import { useAppDispatch } from '../../redux/hooks';
import { MAX_QUERY_PAGES } from '../../api/constants';
import { selectAuthStatus } from '../../redux/auth-reducer';
import { Status } from '../../redux/status.enum';
import { Spinner } from '../spinner';
import { ERR_RESOURCE_NOT_AVAILABLE } from '../../common/constants';
import { CustomText } from '../custom-text';

export const VacancyListPaginationWithPageRequest = () => {
  const vacanciesStatus = useAppSelector(selectVacanciesStatus);
  const vacancies = useAppSelector(selectVacancies);
  const totalVacancies = useAppSelector(selectTotalVacancies);
  const currentPage = useAppSelector(selectCurrentPage);

  const authStatus = useAppSelector(selectAuthStatus);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (vacanciesStatus === Status.IDLE) {
      dispatch(getVacanciesData({}));
    }

    if (vacanciesStatus === Status.FAILED && authStatus === Status.SUCCEEDED) {
      dispatch(getVacanciesData({}));
    }
  }, [vacanciesStatus, authStatus]);

  const totalPages = Math.ceil(totalVacancies / DEFAULT_ITEMS_PER_PAGE);

  const handlePageClick = ({ selected }: { selected: number }) => {
    dispatch(getVacanciesData({ page: selected }));
  };

  const prepareDisplay = () => {
    if (vacanciesStatus === Status.FAILED && authStatus === Status.FAILED) {
      return <CustomText text={ERR_RESOURCE_NOT_AVAILABLE}></CustomText>;
    }
    if (vacanciesStatus === Status.LOADING || authStatus === Status.LOADING) {
      return <Spinner></Spinner>;
    }
    if (vacanciesStatus === Status.SUCCEEDED && vacancies.length === 0) {
      return <CustomText text={'Упс. Таких вакансий нет...'}></CustomText>;
    }
    return <VacancyList items={vacancies}></VacancyList>;
  };

  return (
    <div className={styles.vacancyListWithPagination}>
      {prepareDisplay()}
      <ReactPaginate
        previousLabel=''
        breakLabel='...'
        nextLabel=''
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={totalPages > MAX_QUERY_PAGES ? MAX_QUERY_PAGES : totalPages}
        forcePage={currentPage}
        renderOnZeroPageCount={null}
        containerClassName={styles.pagination}
        previousClassName={styles.pagination__pageItem}
        pageClassName={styles.pagination__pageItem}
        breakClassName={styles.pagination__pageItem}
        nextClassName={styles.pagination__pageItem}
        activeClassName={styles.pagination__pageItem_active}
        previousLinkClassName={styles.pagination__pageLink_previous}
        pageLinkClassName={styles.pagination__pageLink}
        breakLinkClassName={styles.pagination__pageLink}
        nextLinkClassName={styles.pagination__pageLink_next}
        activeLinkClassName={styles.pagination__pageLink_active}
        disabledClassName={styles.pagination__pageItem_disabled}
        disabledLinkClassName={styles.pagination__pageLink_disabled}
      />
    </div>
  );
};
