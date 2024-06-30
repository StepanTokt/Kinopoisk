import "./FilmCard.css";
import Stars from "../stars/Stars";
import {Link} from 'react-router-dom'

const FilmCard = ({film}) => {
  return (
    <div className="film_card">
      <Link to={`/film/${film.id}`} className="link">
        <img src={film.poster} className="film_poster" alt="" />
        <div className="info-block">
          <h3 className="film_title">{film.title}</h3>
          <div className="text">
            <span className="label">Жанр</span>
            <span className="value">{film.genre}</span>
          </div>
          <div className="text">
            <span className="label">Год выпуска</span>
            <span className="value">{film.release_year}</span>
          </div>
          <div className="text">
            <span className="label">Описание</span>
            <span className="value">{film.description}</span>
          </div>
        </div>
      </Link>

      {localStorage.getItem('token') ? <Stars id={film.id} refetch={null}/> : null}
    </div>
  );
};


export default FilmCard