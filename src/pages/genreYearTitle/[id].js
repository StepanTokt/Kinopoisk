import style from '../../styles/FilmList.module.css'
import strelka from "../../../public/strelka.svg";
import FilmCard from "../../components/filmCard/FilmCard";
import { useGetMoviesQuery } from "../../components/api/apiSlice";
import Spinner from "../../components/spinner/Spinner";

import { useSelector, useDispatch } from "react-redux";
import { useMemo, useEffect, useState, useRef } from "react";
// import { activeGenreChanged, activeYearChanged } from "../actions/actions";
import Empty from "../../components/empty/Empty";
import Image from "next/image";
import { useRouter } from 'next/router';
import styles from '../../styles/MainPage.module.css'
import SearchPanel from '@/components/searchPanel/SearchPanel';
import FilterPanel from '@/components/filterPanel/FilterPanel';

const GenreYearTitlePage = ()=>{


	return (
    <div className={styles.main_block}>
      <div className={styles.left_block}>
		<FilterPanel/>
	  </div>
      <div className={styles.right_block}>
        <SearchPanel />
        <GenreYearTitle/>
      </div>
    </div>
  );
}

export default GenreYearTitlePage





const GenreYearTitle = () => {
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState("");
  const [keyActiveGenre, setKeyActiveGenre] = useState("");
  const { filters } = useSelector(
    (state) => state.filters
  );
  const [keyActiveYear, setKeyActiveYear] = useState('')

  const router = useRouter(); // Use the router
  const { id } = router.query; // Extract genre from the query
  
  useEffect(() => {
    

    if (id) {
        let [genre, year, title] = id.split('+');
        if(!genre) genre = ''
        if(!year) year = ''
        if(!title) title = ''
        setTitle(title)
        console.log(genre, year, title)

        setKeyActiveYear(year)
        for(const key in filters[0]){
            if(filters[0][key] == genre) {
                setKeyActiveGenre(key)
            }
        }
           
    }
  }, [id]);

  const {
    data: films = {},
    isFetching, //последующие запросы после loading
    isLoading, // в первый раз запросили данные
    isSuccess, //данные загрузились
    isError, //ошибка
    error,
    refetch
  } = useGetMoviesQuery([page, keyActiveGenre, keyActiveYear, title]);
  


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


