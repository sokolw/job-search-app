import styles from './filter-container.module.css';
import { Dropdown } from '../dropdown';
import { InputNumberWithControls } from '../input-number-with-controls';
import { TextButton } from '../text-button';
import { PrimaryButton } from '../primary-button';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  resetWithoutKeyword,
  selectWithoutKeyword,
  setCatalogIndustry,
  setIsSubmitted,
  setPaymentFrom,
  setPaymentTo,
  validateFilter,
} from '../../redux/filter-reducer';
import { useEffect } from 'react';
import { getCataloguesData, selectCatalogues, selectCataloguesStatus } from '../../redux/catalogues-reducer';
import { getVacanciesData } from '../../redux/vacancies-reducer';
import { Status } from '../../redux/status.enum';

export const FilterContainer = () => {
  const cataloguesStatus = useAppSelector(selectCataloguesStatus);
  const catalogues = useAppSelector(selectCatalogues);

  const { catalogIndustryTitle, catalogIndustryKey, paymentFrom, paymentTo, validationErrors, isSubmitted } =
    useAppSelector(selectWithoutKeyword);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (cataloguesStatus === Status.IDLE) {
      dispatch(getCataloguesData());
    }

    if (validationErrors.length === 0 && isSubmitted) {
      dispatch(setIsSubmitted(false));
      dispatch(getVacanciesData({}));
    }
  }, [cataloguesStatus, validationErrors]);

  const handlerPaymentFrom = (value: number) => {
    dispatch(setPaymentFrom(value));
  };

  const handlerPaymentTo = (value: number) => {
    dispatch(setPaymentTo(value));
  };

  const handlerApplyButton = () => {
    dispatch(validateFilter());
  };

  const handlerCatalogIndustries = (title: string, key: number) => {
    dispatch(setCatalogIndustry({ title, key }));
  };

  const handlerResetFilterButton = () => {
    dispatch(resetWithoutKeyword());
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterContainer__titleGroup}>
        <h2 className={styles.filterContainer__title}>Фильтры</h2>
        <TextButton callback={handlerResetFilterButton}></TextButton>
      </div>
      <div className={styles.filterContainer__industryGroup}>
        <Dropdown
          status={cataloguesStatus}
          selectedTitle={catalogIndustryTitle}
          selectedKey={catalogIndustryKey}
          options={catalogues}
          callback={handlerCatalogIndustries}
        ></Dropdown>
      </div>
      <div className={`${styles.filterContainer__salaryGroup} ${styles.salary}`}>
        <h3 className={styles.salary__title}>Оклад</h3>
        <InputNumberWithControls
          currValue={paymentFrom}
          callback={handlerPaymentFrom}
          placeholder='От'
        ></InputNumberWithControls>
        <InputNumberWithControls
          currValue={paymentTo}
          callback={handlerPaymentTo}
          placeholder='До'
        ></InputNumberWithControls>
      </div>
      <PrimaryButton width={275} height={40} content={'Применить'} callback={handlerApplyButton}></PrimaryButton>
    </div>
  );
};
