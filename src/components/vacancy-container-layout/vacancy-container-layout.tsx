import styles from './vacancy-container-layout.module.css';
import { FilterContainer } from '../filter-container';
import { SearchField } from '../search-field';
import { VacancyListPaginationWithPageRequest } from '../vacancy-list-pagination';

export const VacancyContainerLayout = () => {
  return (
    <div className={`wrapper ${styles.vacancyContainerLayout}`}>
      <div className={styles.vacancyFilterLayout}>
        <FilterContainer></FilterContainer>
      </div>
      <div className={styles.vacancyListLayout}>
        <SearchField></SearchField>
        <VacancyListPaginationWithPageRequest></VacancyListPaginationWithPageRequest>
      </div>
    </div>
  );
};
