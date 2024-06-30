import React, { useState, useRef, useEffect } from "react";
import styles from '../../styles/FilterPanel.module.css'
import selectArrow from '../../../public/arrow-square-down.svg'
import { activeGenreChanged, activeYearChanged } from "../actions/actions";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { useRouter } from 'next/router';

const FilterBlock = () => {
  const [isGenreOpened, setIsGenreOpened] = useState(false);
  const [isYearOpened, setIsYearOpened] = useState(false);
  const [currGenre, setCurrGenre] = useState("");
  const [currYear, setCurrYear] = useState("");

  const genreRef = useRef(null);
  const yearRef = useRef(null);

  //dispatch для redux
  const dispatch = useDispatch();
  //фильтры
  const { filters, activeGenre, activeYear } = useSelector(
    (state) => state.filters
  );

  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event) {
      if (genreRef.current && !genreRef.current.contains(event.target)) {
        setIsGenreOpened(false);
      }
      if (yearRef.current && !yearRef.current.contains(event.target)) {
        setIsYearOpened(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleGenreDropdown = () => {
    setIsGenreOpened(!isGenreOpened);
  };

  const toggleYearDropdown = () => {
    setIsYearOpened(!isYearOpened);
  };

  const handleGenreChange = (e) => {
    const genre = e.target.textContent;
    setCurrGenre(genre);
    dispatch(activeGenreChanged(genre));
    redirectToFilteredPage(genre, currYear);
  };

  const handleYearChange = (e) => {
    const year = e.target.textContent;
    console.log(year)
    setCurrYear(year);
    dispatch(activeYearChanged(year));
    redirectToFilteredPage(currGenre, year);
  };

  const redirectToFilteredPage = (genre, year) => {
    // console.log(genre, year)
    let title
    if(router.query.id) title = router.query.id.split('+')[2]
    if(!title) title = ''

    let genreSlug = genre !== "" ? genre : "Не выбран";
    let yearSlug = year !== "" ? year : "Не выбран";
    router.push(`/genreYearTitle/${genreSlug}+${yearSlug}+${title}`);
  };

  return (
    <div className={styles.filter_block}>
      <h3 className={styles.filter_title}>Фильтр</h3>

      <label className={styles.label}>Жанр</label>
      <div className={styles.dropdown} ref={genreRef}>
        <div
          className={`${styles['custom-select']} ${isGenreOpened ? styles.active_select : ''}`}
          onClick={toggleGenreDropdown}
        >
          {currGenre !== "" ? (
            <p className={styles.dropdown_genre}>{currGenre}</p>
          ) : (
            <p className={styles.dropdown_genre_notSelected}>Выберите жанр</p>
          )}
          <Image
            src={selectArrow}
            alt="Select Arrow"
            className={`${styles['dropdown_arrow']} ${isGenreOpened ? styles.open : ''}`}
          />
        </div>
        {isGenreOpened && (
          <div className={styles.dropdown_content}>
            {Object.values(filters[0]).map((genre, index) => (
              <div
                className={styles.one_genre}
                key={index}
                onClick={handleGenreChange}
              >
                {genre}
              </div>
            ))}
          </div>
        )}
      </div>

      <label className={styles.label}>Год выпуска</label>
      <div className={styles.dropdown} ref={yearRef}>
        <div
          className={`${styles['custom-select']} ${isYearOpened ? styles.active_select : ''}`}
          onClick={toggleYearDropdown}
        >
          {currYear === "" ? (
            <p className={styles.dropdown_genre_notSelected}>Выберите год</p>
          ) : (
            <p className={styles.dropdown_genre}>{currYear}</p>
          )}
          <Image
            src={selectArrow}
            alt="Select Arrow"
            className={`${styles['dropdown_arrow']} ${isYearOpened ? styles.open : ''}`}
          />
        </div>
        {isYearOpened && (
          <div className={styles.dropdown_content}>
            {Object.values(filters[1]).map((year, index) => (
              <div
                className={styles.one_genre}
                key={index}
                onClick={handleYearChange}
              >
                {year}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBlock;
