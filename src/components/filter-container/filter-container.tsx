import styles from './filter-container.module.css';
import { Dropdown } from '../dropdown';
import { InputNumberWithControls } from '../input-number-with-controls';
import { TextButton } from '../text-button';
import { PrimaryButton } from '../primary-button';

const industryType = [
  'IT, интернет, связь, телеком',
  'Кадры, управление персоналом',
  'Искусство, культура, развлечения',
  'Банки, инвестиции, лизинг',
  'Дизайн',
  'Машиностроение',
  'Модель',
];

export const FilterContainer = () => {
  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterContainer__titleGroup}>
        <h2 className={styles.filterContainer__title}>Фильтры</h2>
        <TextButton></TextButton>
      </div>
      <div className={styles.filterContainer__industryGroup}>
        <Dropdown options={industryType}></Dropdown>
      </div>
      <div className={`${styles.filterContainer__salaryGroup} ${styles.salary}`}>
        <h3 className={styles.salary__title}>Оклад</h3>
        <InputNumberWithControls placeholder='От'></InputNumberWithControls>
        <InputNumberWithControls placeholder='До'></InputNumberWithControls>
      </div>
      <PrimaryButton width={275} height={40} content={'Применить'}></PrimaryButton>
    </div>
  );
};
