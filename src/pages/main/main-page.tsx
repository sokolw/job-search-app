import { useState } from 'react';
import { Header } from '../../components/header';
import { VacancyContainerLayout } from '../../components/vacancy-container-layout';

export const MainPage = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header></Header>
      <VacancyContainerLayout></VacancyContainerLayout>
    </>
  );
};
