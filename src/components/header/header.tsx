import styles from './header.module.css';
import { Navigation } from '../navigation';
import { Logo } from '../logo';

export const Header = () => {
  return (
    <div className={styles.rootWrapper}>
      <div className={`wrapper ${styles.header}`}>
        <Logo externalClassNames={styles.header__logo}></Logo>
        <Navigation></Navigation>
      </div>
    </div>
  );
};
