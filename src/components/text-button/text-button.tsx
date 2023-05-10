import styles from './text-button.module.css';
import greyCrossImg from './../../assets/icons/gray-cross.svg';
import blue400CrossImg from './../../assets/icons/blue-400-cross.svg';
import blue500CrossImg from './../../assets/icons/blue-500-cross.svg';
import { useState } from 'react';

type TextButtonType = {
  callback: () => void;
};

export const TextButton = (props: TextButtonType) => {
  const { callback } = props;
  const [isHover, setIsHover] = useState(false);
  const [isClick, setIsClick] = useState(false);

  return (
    <button
      className={styles.textButton}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onMouseDown={() => {
        setIsClick(true);
        callback();
      }}
      onMouseUp={() => setIsClick(false)}
    >
      <span
        className={`${styles.textButton__text} ${isHover && !isClick ? styles.textButton__text_hover : ''} ${
          isHover && isClick ? styles.textButton__text_click : ''
        }`}
      >
        Сбросить все
      </span>
      {(() => {
        if (isHover && !isClick) {
          return <img src={blue400CrossImg} alt='blue-cross' />;
        }
        if (isHover && isClick) {
          return <img src={blue500CrossImg} alt='blue-cross' />;
        }
        return <img src={greyCrossImg} alt='grey-cross' />;
      })()}
    </button>
  );
};
