import styles from './input-number-with-controls.module.css';
import increaseImg from './../../assets/icons/small-increase.svg';
import { useState } from 'react';

type InputNumberWithControlsType = {
  placeholder: string;
};

export const InputNumberWithControls = (props: InputNumberWithControlsType) => {
  const { placeholder } = props;
  const [currValue, setCurrValue] = useState(0);

  return (
    <div className={styles.inputNumberWithControls}>
      <input
        className={styles.input}
        type='text'
        autoComplete='off'
        placeholder={placeholder}
        value={currValue !== 0 ? currValue : ''}
        onInput={(event) => {
          const { value } = event.currentTarget;
          if (value.length > 0 && !Number.isNaN(+value) && +value > 0) {
            setCurrValue(+value);
          }
          if (value.length === 0) {
            setCurrValue(0);
          }
        }}
      />
      <div className={styles.groupControls}>
        <img
          className={styles.groupControls__increase}
          src={increaseImg}
          alt='increase'
          onClick={() => setCurrValue(currValue + 1)}
        />
        <img
          className={styles.groupControls__decrease}
          src={increaseImg}
          alt='decrease'
          onClick={() => setCurrValue(currValue > 0 ? currValue - 1 : 0)}
        />
      </div>
    </div>
  );
};
