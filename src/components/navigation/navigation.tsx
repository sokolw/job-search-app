import styles from './navigation.module.css';

export const Navigation = () => {
  return (
    <div className={styles.navigation}>
      <span className={`${styles.navigation__text} ${styles.navigation__text_active}`}>Поиск Вакансий</span>
      <span className={styles.navigation__text}>Избранное</span>
    </div>
  );
};
