import style from '../../styles/FilmPage.module.css'
import strelka from "../../../public/strelka.svg";
import ActorCard from '../../components/actorCard/ActorCard';
import { useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetMovieByIdQuery } from "../../components/api/apiSlice";
import Spinner from "../../components/spinner/Spinner";
import Stars from '../../components/stars/Stars';
import Image from "next/image";
import { useRouter } from 'next/router';


const FilmPage = () => {

const [isScrolledRight, setIsScrolledRight] = useState(false)
const [isScrolledLeft, setIsScrolledleft] = useState(false)

const router = useRouter()
const { id } = router.query;

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
    <div className={style.film_page}>
      <div className={style.film_block}>
        <Image src={film.poster} className={style.film_photo} alt="" width={400} height={500}/>
        <div className={style.information_block}>
          <h3 className={style.film_name}>{film.title}</h3>
          <div className={style.info}>
            <span className={style.type}>Жанр: </span>
            {` ${film.genre}`}
          </div>
          <div className={style.info}>
            <span className={style.type}>Год выпуска: </span>
            {film.release_year}
          </div>
          <div className={style.info}>
            <span className={style.type}>Рейтинг: </span> {film.rating}
          </div>
          <div className={style.info}>
            <span className={style.type}>Описание</span>
          </div>
          <span className={style.info_value}>{film.description}</span>
        </div>
        {localStorage.getItem("token") ? (
          <Stars id={film.id} refetch={refetch} />
        ) : null}
      </div>
      <h3 className={style.actors_title}>Актёры</h3>
      <div className={style.actors_wrapper} ref={scrollWrapper}>
        <button
          className={`${style.left_scrollBtn} ${
            isScrolledLeft ? style.show : style.hide
          }`}
          onClick={scrollLeft}
        >
          <Image src={strelka} alt="" className={style.l_strelka} />
        </button>

        {film.actors.length > 0 ? (
          film.actors.map((actor) => <ActorCard actor={actor} key={actor} />)
        ) : (
          <h5 className="text-center mt-5">Актёров нет</h5>
        )}

        <button
          className={`${style.right_scrollBtn} ${
            isScrolledRight ? style.show : style.hide
          }`}
          onClick={scrollRight}
        >
          <Image src={strelka} alt="" className={style.r_strelka} />
        </button>
      </div>
    </div>
  );
  
}

export default FilmPage



