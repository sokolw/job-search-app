import styles from './custom-text.module.css';

type CustomTextType = {
  text: string;
};

export const CustomText = ({ text }: CustomTextType) => {
  return <p className={styles.customText}>{text}</p>;
};
