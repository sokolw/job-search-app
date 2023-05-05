import styles from './primary-button.module.css';
import { useState } from 'react';

type PrimaryButtonType = {
  width: number;
  height: number;
  content: string;
};

export const PrimaryButton = (props: PrimaryButtonType) => {
  const { width, height, content } = props;
  const [isHover, setIsHover] = useState(false);
  const [isClick, setIsClick] = useState(false);

  return (
    <button
      className={`${styles.primaryButton} ${isHover && !isClick ? styles.primaryButton_hover : ''} ${
        isHover && isClick ? styles.primaryButton_click : ''
      }`}
      style={{ width, height }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onMouseDown={() => setIsClick(true)}
      onMouseUp={() => setIsClick(false)}
    >
      {content}
    </button>
  );
};
