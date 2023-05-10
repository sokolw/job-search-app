import styles from './dropdown.module.css';
import selectGrayImg from '../../assets/icons/select-gray-down.svg';
import selectBlueImg from '../../assets/icons/select-blue-down.svg';
import { useState } from 'react';
import { CatalogIndustriesResponse } from '../../common/types/catalog-industries-response';
import { ERR_RESOURCE_NOT_AVAILABLE } from '../../common/constants';
import { Status } from '../../redux/status.enum';
import { CustomText } from '../custom-text';
import { Spinner } from '../spinner';

type DropdownType = {
  status: string;
  options: CatalogIndustriesResponse;
  selectedTitle: string;
  selectedKey: number;
  callback: (title: string, key: number) => void;
};

export const Dropdown = (props: DropdownType) => {
  const { options, callback, selectedTitle, selectedKey, status } = props;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const items = options.map((item) => (
    <div
      className={`${styles.option} ${item.key === selectedKey ? styles.option_active : ''}`}
      key={item.key}
      onClick={() => {
        callback(item.title_rus, item.key);
        setIsDropdownOpen(false);
      }}
    >
      <span className={`${styles.option__text} ${item.key === selectedKey ? styles.option__text_active : ''}`}>
        {item.title_rus}
      </span>
    </div>
  ));

  const toggleDropdown = () => {
    setIsDropdownOpen((previous) => !previous);
  };

  const prepareDisplay = () => {
    if (status === Status.FAILED) {
      return <CustomText text={ERR_RESOURCE_NOT_AVAILABLE}></CustomText>;
    }
    if (status === Status.LOADING) {
      return <Spinner></Spinner>;
    }
    return items;
  };

  return (
    <div className={styles.dropdown}>
      <h3 className={styles.dropdown__title}>Отрасль</h3>
      <div className={`${styles.select} ${isDropdownOpen ? styles.select_active : ''}`} onClick={toggleDropdown}>
        <div className={styles.select__content}>
          <div className={`${styles.select__value} ${selectedKey > 0 ? styles.select__value_active : ''}`}>
            {selectedTitle}
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
        <div className={styles.dropdown__options}>{prepareDisplay()}</div>
      </div>
    </div>
  );
};
