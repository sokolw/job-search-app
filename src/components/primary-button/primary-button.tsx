import styles from './primary-button.module.css';
import { useState } from 'react';

type PrimaryButtonType = {
  width: number;
  height: number;
  content: string;
  callback: () => void;
};

export const PrimaryButton = (props: PrimaryButtonType) => {
  const { width, height, content, callback } = props;
  const [isHover, setIsHover] = useState(false);
  const [isClick, setIsClick] = useState(false);

  return (
    <button
      data-elem='search-button'
      className={`${styles.primaryButton} ${isHover && !isClick ? styles.primaryButton_hover : ''} ${
        isHover && isClick ? styles.primaryButton_click : ''
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
