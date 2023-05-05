import styles from './search-field.module.css';
import { PrimaryButton } from '../primary-button';
import lensImg from './../../assets/icons/lens.svg';
import { useState } from 'react';

type SearchFieldType = {
  placeholder: string;
};

export const SearchField = (props: SearchFieldType) => {
  const { placeholder } = props;
  const [isFocus, setIsFocus] = useState(false);

  return (
    <div className={`${styles.searchField} ${isFocus ? styles.searchField_focus : ''}`}>
      <img src={lensImg} alt='lens' />
      <input
        className={styles.searchField__input}
        type='text'
        placeholder={placeholder}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      />
      <PrimaryButton width={83} height={32} content={'Поиск'}></PrimaryButton>
    </div>
  );
};
