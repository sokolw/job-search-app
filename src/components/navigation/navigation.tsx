import { NavLink } from 'react-router-dom';
import styles from './navigation.module.css';

export const Navigation = () => {
  const handlerNavLinkStyles = ({ isActive, isPending }: { isActive: boolean; isPending: boolean }) =>
    isPending
      ? styles.navigation__text
      : isActive
      ? `${styles.navigation__text} ${styles.navigation__text_active}`
      : styles.navigation__text;

  return (
    <div className={styles.navigation}>
      <NavLink to={``} className={handlerNavLinkStyles}>
        Поиск Вакансий
      </NavLink>
      <NavLink to={`favorites`} className={handlerNavLinkStyles}>
        Избранное
      </NavLink>
    </div>
  );
};
