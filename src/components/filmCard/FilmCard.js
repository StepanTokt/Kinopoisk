import style from '../../styles/FilmCard.module.css';
import Stars from '../stars/Stars';
import Link from 'next/link';
import Image from "next/image";

const FilmCard = ({ film }) => {
  return (
    <div className={style.film_card}>
      <Link href={`/movie/${film.id}`} className={style.link}>
        <Image src={film.poster} className={style.film_poster} alt="" width={100} height={120}/>
        <div className={style.info_block}>
          <h3 className={style.film_title}>{film.title}</h3>
          <div className={style.text}>
            <span className={style.label}>Жанр</span>
            <span className={style.value}>{film.genre}</span>
          </div>
          <div className={style.text}>
            <span className={style.label}>Год выпуска</span>
            <span className={style.value}>{film.release_year}</span>
          </div>
          <div className={style.text}>
            <span className={style.label}>Описание</span>
            <span className={style.value}>{film.description}</span>
          </div>
        </div>
      </Link>

      {localStorage.getItem('token') ? <Stars id={film.id} refetch={null} /> : null}
    </div>
  );
};

export default FilmCard;
