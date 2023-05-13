import { useEffect } from 'react';
import { LoaderFunctionArgs, useLoaderData, useNavigate } from 'react-router-dom';
import { ShortVacancyCard } from '../../components/short-vacancy-card';
import styles from './vacancy-page.module.css';
import { useAppSelector } from '../../redux/hooks';
import { selectVacancyById } from '../../redux/vacancies-reducer';
import { salaryFormatter } from '../../components/vacancy-list/vacancy-list';
import { VacancyDescriptionContainer } from '../../components/vacancy-description-container';

export const vacancyPageLoader = async ({ params }: LoaderFunctionArgs) => {
  return { id: params.id ? +params.id : undefined };
};

export const VacancyPage = () => {
  const { id } = useLoaderData() as { id: number };
  const vacancy = useAppSelector(selectVacancyById(id));
  const navigate = useNavigate();

  useEffect(() => {
    if (!vacancy) {
      navigate('/');
    }
  }, [vacancy]);

  if (!vacancy) {
    return <></>;
  }

  return (
    <div className={`wrapper ${styles.vacancyPage}`}>
      <div className={`${styles.vacancyPage__container}`}>
        <ShortVacancyCard
          title={vacancy.profession}
          salary={salaryFormatter(vacancy.payment_from, vacancy.payment_to, vacancy.currency)}
          condition={vacancy.type_of_work.title}
          place={vacancy.town.title}
          id={vacancy.id}
          isFavorite={vacancy.isFavorite}
          enableAdditionalStyle={true}
        ></ShortVacancyCard>
        <VacancyDescriptionContainer content={vacancy.vacancyRichText}></VacancyDescriptionContainer>
      </div>
    </div>
  );
};
