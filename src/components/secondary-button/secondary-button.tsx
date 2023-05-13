import styles from './secondary-button.module.css';
import { useState } from 'react';

type SecondaryButtonType = {
  width: number;
  height: number;
  content: string;
  callback: () => void;
};

export const SecondaryButton = (props: SecondaryButtonType) => {
  const { width, height, content, callback } = props;
  const [isHover, setIsHover] = useState(false);
  const [isClick, setIsClick] = useState(false);

  return (
    <button
      className={`${styles.secondaryButton} ${isHover && !isClick ? styles.secondaryButton_hover : ''} ${
        isHover && isClick ? styles.secondaryButton_click : ''
      }`}
      style={{ width, height }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onMouseDown={() => {
        setIsClick(true);
        callback();
      }}
      onMouseUp={() => setIsClick(false)}
    >
      {content}
    </button>
  );
};
