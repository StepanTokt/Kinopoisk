import React, { useState, useRef, useEffect } from "react";
import "./FilterPanel.css";
import selectArrow from '../../resources/arrow-square-down.svg'
import { activeGenreChanged, activeYearChanged } from "../../logic/actions/actions";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const location = useLocation();

  //////////////////////////////////////////////////////////////////
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

  //////////////////////////////////////////////////////////////////

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const genre = params.get("genre") || "Не выбран";
    const year = params.get("year") || "Не выбран";

    dispatch(activeGenreChanged(genre));
    dispatch(activeYearChanged(year));
  }, [location.search, dispatch]);

  const updateURLParams = (key, value) => {
    const params = new URLSearchParams(location.search);
    if (value === "Не выбран") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    navigate({ search: params.toString() });
  };

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
    updateURLParams("genre", genre);
  };

  const handleYearChange = (e) => {
    const year = e.target.textContent;
    setCurrYear(year);
    dispatch(activeYearChanged(year));
    updateURLParams("year", year);
  };

  return (
    <div className="filter_block">
      <h3 className="filter_title">Фильтр</h3>

      <label>Жанр</label>
      <div className="dropdown" ref={genreRef}>
        <div
          className={`custom-select ${isGenreOpened ? "active_select" : ""}`}
          onClick={() => {
            toggleGenreDropdown();
          }}
        >
          {currGenre !== "" ? (
            <p className="dropdown_genre">{currGenre}</p>
          ) : (
            <p className="dropdown_genre_notSelected">Выберите жанр</p>
          )}
          <img
            src={selectArrow}
            alt=""
            className={`dropdown_arrow ${isGenreOpened ? "open" : ""}`}
          />
        </div>
        {isGenreOpened && (
          <div className="dropdown-content">
            {Object.values(filters[0]).map((genre, index) => (
              <div
                className="one_genre"
                key={index}
                onClick={(e) => {
                  console.log("click");
                  handleGenreChange(e);
                }}
              >
                {genre}
              </div>
            ))}
          </div>
        )}
      </div>

      <label>Год выпуска</label>
      <div className="dropdown" ref={yearRef}>
        <div
          className={`custom-select ${isYearOpened ? "active_select" : ""}`}
          onClick={() => {
            toggleYearDropdown();
          }}
        >
          {currYear === "" ? (
            <p className="dropdown_genre_notSelected">Выберите год</p>
          ) : (
            <p className="dropdown_genre">{currYear}</p>
          )}
          <img
            src={selectArrow}
            alt=""
            className={`dropdown_arrow ${isYearOpened ? "open" : ""}`}
          />
        </div>
        {isYearOpened && (
          <div className="dropdown-content">
            {Object.values(filters[1]).map((year, index) => (
              <div
                className="one_genre"
                key={index}
                onClick={(e) => {
                  handleYearChange(e);
                }}
              >
                {year}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* <label htmlFor="year">Год выпуска</label>
      <div
        ref={yearRef}
        className={`custom-select ${isYearOpened ? "open" : ""}`}
        onClick={toggleYearDropdown}
      >
        <select id="year" value={activeYear} onChange={handleYearChange}>
          {Object.values(filters[1]).map((year, index) => (
            <option key={index}>{year}</option>
          ))}
        </select>
      </div> */}
    </div>
  );
};

export default FilterBlock;
