import styles from './short-vacancy-card.module.css';
import { SaveButton } from '../save-button';
import grayLocationImg from './../../assets/icons/gray-location.svg';
import { useAppDispatch } from '../../redux/hooks';
import { addToFavoriteVacancies, removeFromFavoriteVacancies } from '../../redux/vacancies-reducer';

type ShortVacancyCardType = {
  title: string;
  salary: string;
  condition: string;
  place: string;
  id: number;
  isFavorite: boolean;
};

export const ShortVacancyCard = ({ title, place, condition, salary, id, isFavorite }: ShortVacancyCardType) => {
  const dispatch = useAppDispatch();

  const handleVacancySave = (saved: boolean) => {
    if (saved) {
      dispatch(addToFavoriteVacancies({ id }));
    } else {
      dispatch(removeFromFavoriteVacancies({ id }));
    }
  };

  return (
    <div className={styles.shortVacancyCard}>
      <div className={styles.shortVacancyCard__content}>
        <a className={styles.shortVacancyCard__title} href={`#${id}`}>
          {title}
        </a>
        <div className={styles.shortVacancyCard__description}>
          <span className={styles.shortVacancyCard__salary}>{salary}</span>
          <span className={styles.shortVacancyCard__delimiter}>•</span>
          <span className={styles.shortVacancyCard__condition}>{condition}</span>
        </div>
        <div className={styles.shortVacancyCard__location}>
          <img src={grayLocationImg} alt='location' />
          <span className={styles.shortVacancyCard__place}>{place}</span>
        </div>
      </div>
      <SaveButton saved={isFavorite} callback={handleVacancySave}></SaveButton>
    </div>
  );
};
