import style from '../../styles/Empty.module.css'
const Empty = () => {
  return (
    <div className={style.wrapper}>
      <h2>Фильмы не найдены</h2>
      <p>Измените запрос и попробуйте снова</p>
    </div>
  );
};

export default Empty;
