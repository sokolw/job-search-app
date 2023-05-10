import styles from './input-number-with-controls.module.css';
import increaseImg from './../../assets/icons/small-increase.svg';

type InputNumberWithControlsType = {
  placeholder: string;
  currValue: number;
  callback: (value: number) => void;
};

export const InputNumberWithControls = (props: InputNumberWithControlsType) => {
  const { placeholder, currValue, callback } = props;

  return (
    <div className={styles.inputNumberWithControls}>
      <input
        className={styles.input}
        type='text'
        autoComplete='off'
        placeholder={placeholder}
        value={currValue >= 0 ? currValue : ''}
        onInput={(event) => {
          const { value } = event.currentTarget;
          if (value.length > 0 && !Number.isNaN(+value) && +value >= 0) {
            callback(+value);
          }
          if (value.length === 0) {
            callback(-1);
          }
        }}
      />
      <div className={styles.groupControls}>
        <img
          className={styles.groupControls__increase}
          src={increaseImg}
          alt='increase'
          onClick={() => callback(currValue + 1)}
        />
        <img
          className={styles.groupControls__decrease}
          src={increaseImg}
          alt='decrease'
          onClick={() => callback(currValue > 0 ? currValue - 1 : 0)}
        />
      </div>
    </div>
  );
};
