import styles from './save-button.module.css';
import { useState } from 'react';
import grayStarImg from './../../assets/icons/gray-star.svg';
import blueStarImg from './../../assets/icons/blue-star.svg';
import filledBlueStarImg from './../../assets/icons/filled-blue-star.svg';

type SaveButtonType = {
  saved: boolean;
  callback: (saved: boolean) => void;
  id: number;
};

export const SaveButton = ({ saved, callback, id }: SaveButtonType) => {
  const [isHover, setIsHover] = useState(false);
  const [isActive, setIsActive] = useState(saved);

  return (
    <button
      data-elem={`vacancy-${id}-shortlist-button`}
      className={styles.saveButton}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => {
        setIsActive(!isActive);
        callback(!isActive);
      }}
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
