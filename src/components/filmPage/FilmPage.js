import './FilmPage.css'
import strelka from "../../resources/strelka.svg";
import ActorCard from '../actorCard/ActorCard';
import { useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetMovieByIdQuery } from "../../logic/api/apiSlice";
import Spinner from "../spinner/Spinner";
import Stars from '../stars/Stars';

const FilmPage = () => {

const [isScrolledRight, setIsScrolledRight] = useState(false)
const [isScrolledLeft, setIsScrolledleft] = useState(false)

const { id } = useParams();

const {
  data: film = {},
  isFetching, //последующие запросы после loading
  isLoading, // в первый раз запросили данные
  isSuccess, //данные загрузились
  isError, //ошибка
  error,
  refetch,
} = useGetMovieByIdQuery(id, { refetchOnMountOrArgChange: true })




 const checkScroll = () => {
   if (scrollWrapper.current) {
     setIsScrolledleft(scrollWrapper.current.scrollLeft > 20);
     setIsScrolledRight(
       scrollWrapper.current.scrollWidth >
         scrollWrapper.current.scrollLeft + scrollWrapper.current.clientWidth +40
     );
   }
 };

const scrollWrapper = useRef(null)

const scrollAmount = 400;
  useEffect(() => {
    checkScroll();
    if (scrollWrapper.current) {
      scrollWrapper.current.addEventListener("scroll", checkScroll);
    }
    return () => {
      if (scrollWrapper.current) {
        scrollWrapper.current.removeEventListener("scroll", checkScroll);
      }
    };
  }, [isScrolledLeft, isScrolledRight]);


  const scrollLeft = () => {
    scrollWrapper.current.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollWrapper.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  if (isLoading || isFetching) {
    return  <Spinner/>
  } else if (isError) {
    return <h5 className="text-center mt-5">Ошибка загрузки</h5>
  }

	return (
    <div className="film_page">
      <div className="film_block">
        <img src={film.poster} className="film_photo" alt="" />
        <div className="information-block">
          <h3 className="film_name">{film.title}</h3>
          <div className="info">
            <span className="type">Жанр: </span> {film.genre}
          </div>
          <div className="info">
            <span className="type">Год выпуска: </span>
            {film.release_year}
          </div>
          <div className="info">
            <span className="type">Рейтинг: </span> {film.rating}
          </div>
          <div className="info">
            <span className="type">Описание</span>
          </div>
          <span className="info_value">{film.description}</span>
        </div>
        {localStorage.getItem('token') ? <Stars id={film.id} refetch={refetch}/> : null}
      </div>
      <h3 className="actors_title">Актёры</h3>
      <div className="actors_wrapper" ref={scrollWrapper}>
        <button
          className={`left_scrollBtn ${isScrolledLeft ? "show" : "hide"}`}
          onClick={scrollLeft}
        >
          <img src={strelka} alt="" className="l_strelka" />
        </button>

        {film.actors.length > 0 ? (
          film.actors.map((actor) => <ActorCard actor={actor} key={actor} />)
        ) : (
          <h5 className="text-center mt-5">Актёров нет</h5>
        )}

        <button
          className={`right_scrollBtn ${isScrolledRight ? "show" : "hide"}`}
          onClick={scrollRight}
        >
          <img src={strelka} alt="" className="r_strelka" />
        </button>
      </div>
    </div>
  );
}

export default FilmPage