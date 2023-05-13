import styles from './short-vacancy-card.module.css';
import { SaveButton } from '../save-button';
import grayLocationImg from './../../assets/icons/gray-location.svg';
import { useAppDispatch } from '../../redux/hooks';
import { addToFavoriteVacancies, removeFromFavoriteVacancies } from '../../redux/vacancies-reducer';
import { Link } from 'react-router-dom';
import { VACANCY } from '../../common/routes';

type ShortVacancyCardType = {
  title: string;
  salary: string;
  condition: string;
  place: string;
  id: number;
  isFavorite: boolean;
  enableAdditionalStyle?: boolean;
};

export const ShortVacancyCard = ({
  title,
  place,
  condition,
  salary,
  id,
  isFavorite,
  enableAdditionalStyle,
}: ShortVacancyCardType) => {
  const dispatch = useAppDispatch();

  const handleVacancySave = (saved: boolean) => {
    if (saved) {
      dispatch(addToFavoriteVacancies({ id }));
    } else {
      dispatch(removeFromFavoriteVacancies({ id }));
    }
  };

  if (enableAdditionalStyle) {
    return (
      <div className={styles.shortVacancyCard} data-elem={`vacancy-${id}`}>
        <div className={styles.shortVacancyCard__content}>
          <h2 className={`${styles.shortVacancyCard__title} ${styles.shortVacancyCard__title_additional}`}>{title}</h2>
          <div className={`${styles.shortVacancyCard__description} ${styles.shortVacancyCard__description_additional}`}>
            <span className={`${styles.shortVacancyCard__salary} ${styles.shortVacancyCard__salary_additional}`}>
              {salary}
            </span>
            <span className={styles.shortVacancyCard__delimiter}>•</span>
            <span className={`${styles.shortVacancyCard__condition} ${styles.shortVacancyCard__condition_additional}`}>
              {condition}
            </span>
          </div>
          <div className={styles.shortVacancyCard__location}>
            <img src={grayLocationImg} alt='location' />
            <span className={styles.shortVacancyCard__place}>{place}</span>
          </div>
        </div>
        <SaveButton id={id} saved={isFavorite} callback={handleVacancySave}></SaveButton>
      </div>
    );
  }

  return (
    <div className={styles.shortVacancyCard} data-elem={`vacancy-${id}`}>
      <div className={styles.shortVacancyCard__content}>
        <Link className={styles.shortVacancyCard__title} to={`${VACANCY}/${id}`}>
          {title}
        </Link>
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
      <SaveButton id={id} saved={isFavorite} callback={handleVacancySave}></SaveButton>
    </div>
  );
};
