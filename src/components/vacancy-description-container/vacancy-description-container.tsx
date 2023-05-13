import styles from './vacancy-description-container.module.css';

type VacancyDescriptionContainerType = {
  content: string;
};

export const VacancyDescriptionContainer = ({ content }: VacancyDescriptionContainerType) => {
  return <div className={styles.vacancyDescriptionContainer} dangerouslySetInnerHTML={{ __html: content }}></div>;
};
