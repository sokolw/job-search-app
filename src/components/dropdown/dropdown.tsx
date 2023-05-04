import styles from './dropdown.module.css';
import selectGrayImg from '../../assets/icons/select-gray-down.svg';
import selectBlueImg from '../../assets/icons/select-blue-down.svg';
import { useState } from 'react';

const DEFAULT_VALUE = 'Выберете отрасль';

type DropdownType = { options: string[] };

export const Dropdown = (props: DropdownType) => {
  const { options } = props;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selected, setSelected] = useState(DEFAULT_VALUE);

  const items = options.map((item) => (
    <div
      className={`${styles.option} ${item === selected ? styles.option_active : ''}`}
      key={item}
      onClick={() => {
        setSelected(item);
        setIsDropdownOpen(false);
      }}
    >
      <span className={`${styles.option__text} ${item === selected ? styles.option__text_active : ''}`}>{item}</span>
    </div>
  ));

  const toggleDropdown = () => {
    setIsDropdownOpen((previous) => !previous);
  };

  return (
    <div className={styles.dropdown}>
      <h3 className={styles.dropdown__title}>Отрасль</h3>
      <div className={`${styles.select} ${isDropdownOpen ? styles.select_active : ''}`} onClick={toggleDropdown}>
        <div className={styles.select__content}>
          <div className={`${styles.select__value} ${selected !== DEFAULT_VALUE ? styles.select__value_active : ''}`}>
            {selected}
          </div>
          {isDropdownOpen ? (
            <img src={selectBlueImg} alt='select-blue' />
          ) : (
            <img src={selectGrayImg} alt='select-gray' />
          )}
        </div>
      </div>
      <div
        className={`${styles.dropdown__optionsWrapper} ${isDropdownOpen ? styles.dropdown__optionsWrapper_open : ''}`}
      >
        <div className={styles.dropdown__options}>{items}</div>
      </div>
    </div>
  );
};
