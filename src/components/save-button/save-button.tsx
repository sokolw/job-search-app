import styles from './save-button.module.css';
import { useState } from 'react';
import grayStarImg from './../../assets/icons/gray-star.svg';
import blueStarImg from './../../assets/icons/blue-star.svg';
import filledBlueStarImg from './../../assets/icons/filled-blue-star.svg';

type SaveButtonType = {
  saved: boolean;
};

export const SaveButton = (props: SaveButtonType) => {
  const { saved } = props;
  const [isHover, setIsHover] = useState(false);
  const [isActive, setIsActive] = useState(saved);

  return (
    <button
      className={styles.saveButton}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => setIsActive(!isActive)}
    >
      {(() => {
        if (isHover && !isActive) {
          return <img src={blueStarImg} alt='star' />;
        }
        if (isActive) {
          return <img src={filledBlueStarImg} alt='star' />;
        }
        return <img src={grayStarImg} alt='star' />;
      })()}
    </button>
  );
};
