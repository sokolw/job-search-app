import styles from './logo.module.css';
import logoImg from '../../assets/icons/logo.svg';

type LogoType = { externalClassNames: string };

export const Logo = (props: LogoType) => {
  const { externalClassNames } = props;
  return (
    <div className={`${styles.logo} ${externalClassNames || ''}`}>
      <img src={logoImg} alt='logo' />
      <h1 className={styles.logo__title}>Jobored</h1>
    </div>
  );
};
