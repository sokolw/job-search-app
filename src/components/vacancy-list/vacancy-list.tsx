import styles from './vacancy-list.module.css';
import { ShortVacancyCard } from '../short-vacancy-card';
import { CustomVacancy } from '../../redux/vacancies-reducer';

type VacancyListType = {
  items: CustomVacancy[];
};

export const salaryFormatter = (from: number, to: number, currency: string): string => {
  const prefix = `з/п`;
  if (from === 0 && to === 0) {
    return `${prefix} не указана`;
  }

  if (from > 0 && to === 0) {
    return `${prefix} от ${from} ${currency}`;
  }

  if (from === 0 && to > 0) {
    return `${prefix} ${to} ${currency}`;
  }
  return `${prefix} ${from} - ${to} ${currency}`;
};

export const VacancyList = ({ items }: VacancyListType) => {
  const shortVacancyCards = items.map((item) => (
    <ShortVacancyCard
      title={item.profession}
      salary={salaryFormatter(item.payment_from, item.payment_to, item.currency)}
      condition={item.type_of_work.title}
      place={item.town.title}
      key={item.id}
      id={item.id}
      isFavorite={item.isFavorite}
    ></ShortVacancyCard>
  ));

  return <div className={styles.vacancyList}>{shortVacancyCards}</div>;
};
