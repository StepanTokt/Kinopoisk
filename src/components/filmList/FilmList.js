import style from '../../styles/FilmList.module.css'
import strelka from "../../../public/strelka.svg";
import FilmCard from "../filmCard/FilmCard";
import { useGetMoviesQuery } from "../api/apiSlice";
import Spinner from "../spinner/Spinner";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useMemo, useEffect, useState, useRef } from "react";
import { activeGenreChanged, activeYearChanged } from "../actions/actions";
import Empty from "../empty/Empty";
import Image from "next/image";
const FilmList = () => {
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState("");
  const [keyActiveGenre, setKeyActiveGenre] = useState("");
  const { filters, activeGenre, activeYear } = useSelector(
    (state) => state.filters
  );

  const {
    data: films = {},
    isFetching, //последующие запросы после loading
    isLoading, // в первый раз запросили данные
    isSuccess, //данные загрузились
    isError, //ошибка
    error,
    refetch
  } = useGetMoviesQuery([page, keyActiveGenre, activeYear, title]);

  useEffect(() => {
    
    for(const key in filters[0]){
      if(filters[0][key] == activeGenre) {
        setKeyActiveGenre(key)
      }
    }
  }, [activeGenre])

 const increasePage = () => {
   if (films.search_result.length === 10) {
     setPage((prevPage) => prevPage + 1);
   }
 };

 const decreasePage = () => {
   setPage((prevPage) => {
     if (prevPage > 1) {
       return prevPage - 1;
     }
     return prevPage;
   });
 };


 
  const dispatch = useDispatch();
  // const location = useLocation();

  // useEffect(() => {
  //   const params = new URLSearchParams(location.search);
  //   const genre = params.get("genre") || "Не выбран";
  //   const year = params.get("year") || "Не выбран";
  //   const title = params.get("title") || "";
  //   setTitle(title);
  //   if (genre !== activeGenre) {
  //     dispatch(activeGenreChanged(genre));
  //   }
  //   if (year !== activeYear) {
  //     dispatch(activeYearChanged(year));
  //   }
  // }, [location.search, dispatch, activeGenre, activeYear]);


  if (isLoading || isFetching) {
    return <Spinner />;
  } else if (isError) {
    return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
  }else if(films.search_result.length === 0){
    return <Empty/>
  }

  return (
    <div className={style.film_list}>
      {films.search_result.map((film) => (
        <FilmCard film={film} key={film.id} />
      ))}
      <div className={style.pagination__block}>
        <button
          className={`${style.pagination__button} ${page === 1 ? style.disabledBtn : ''}`}
          onClick={decreasePage}
          disabled={page === 1}
        >
          <Image src={strelka} alt="" className={`${style.left_strelka} ${page === 1 ? style.disabledStrelka : ''}`} />
        </button>
        <p className={style.pagination__text}>{page}</p>
        <button
          className={`${style.pagination__button} ${films.search_result.length < 10 || page === +films.total_pages ? style.disabledBtn : ''}`}
          onClick={increasePage}
          disabled={films.search_result.length < 10 || page === +films.total_pages}
        >
          <Image src={strelka} alt="" className={style.right_strelka} />
        </button>
      </div>
    </div>
  );
};

export default FilmList;
