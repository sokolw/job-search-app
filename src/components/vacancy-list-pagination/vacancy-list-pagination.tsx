import ReactPaginate from 'react-paginate';
import { CustomVacancy } from '../../redux/vacancies-reducer';
import { VacancyList } from '../vacancy-list';
import styles from './vacancy-list-pagination.module.css';
import { useState } from 'react';

type VacancyListPaginationType = {
  vacancies: CustomVacancy[];
  itemsPerPage: number;
};

export const VacancyListPagination = ({ vacancies, itemsPerPage }: VacancyListPaginationType) => {
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = vacancies.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(vacancies.length / itemsPerPage);

  const handlePageClick = ({ selected }: { selected: number }) => {
    const newOffset = (selected * itemsPerPage) % vacancies.length;
    setItemOffset(newOffset);
  };

  return (
    <div className={styles.vacancyListWithPagination}>
      <VacancyList items={currentItems}></VacancyList>
      <ReactPaginate
        previousLabel=''
        breakLabel='...'
        nextLabel=''
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
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
