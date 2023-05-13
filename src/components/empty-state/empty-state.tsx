import styles from './empty-state.module.css';
import finderImg from './../../assets/icons/finder.svg';
import { SecondaryButton } from './../secondary-button/secondary-button';
import { useNavigate } from 'react-router-dom';

export const EmptyState = () => {
  const navigate = useNavigate();

  const handleRedirectToMainPage = () => {
    navigate('/');
  };

  return (
    <div className={styles.emptyState}>
      <img className={styles.emptyState__img} src={finderImg} alt='finder' />
      <p className={styles.emptyState__text}>Упс, здесь еще ничего нет!</p>
      <SecondaryButton
        content={'Поиск Вакансий'}
        width={164}
        height={42}
        callback={handleRedirectToMainPage}
      ></SecondaryButton>
    </div>
  );
};
