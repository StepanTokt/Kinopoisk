import styles from '../../styles/Spinner.module.css'
const Spinner = () => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.loader}></span>
    </div>
  );
};

export default Spinner;
