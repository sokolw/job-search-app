import styles from './search-field.module.css';
import { PrimaryButton } from '../primary-button';
import lensImg from './../../assets/icons/lens.svg';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectKeyword, setKeyword } from '../../redux/filter-reducer';
import { getVacanciesData } from '../../redux/vacancies-reducer';

export const SearchField = () => {
  const keyword = useAppSelector(selectKeyword);
  const dispatch = useAppDispatch();
  const [isFocus, setIsFocus] = useState(false);

  const handleSearch = () => {
    dispatch(getVacanciesData({}));
  };

  return (
    <div className={`${styles.searchField} ${isFocus ? styles.searchField_focus : ''}`}>
      <img src={lensImg} alt='lens' />
      <input
        data-elem='search-input'
        className={styles.searchField__input}
        type='text'
        value={keyword}
        placeholder={'Введите название вакансии'}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onInput={(event) => dispatch(setKeyword(event.currentTarget.value))}
        onKeyDown={(event) => {
          if (event.code === 'Enter') {
            handleSearch();
          }
        }}
      />
      <PrimaryButton width={83} height={32} content={'Поиск'} callback={handleSearch}></PrimaryButton>
    </div>
  );
};
