import Image from "next/image";
import styles from "../../styles/SearchPanel.module.css";
import searchIcon from "../../../public/search-icon.svg";
import crossIcon from "../../../public/cross-icon.svg";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRouter } from 'next/router';

const SearchPanel = () => {
  const [inputValue, setInputValue] = useState("");
  const crossIconRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();
  // const navigate = useNavigate();
  // const location = useLocation();

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

 

  const changeInputValue = (e) => {
    let newValue = e.target.value.trim();
    setInputValue(newValue);
    updateURLParams("title", newValue);
    if (newValue !== "" && crossIconRef.current) {
      crossIconRef.current.classList.remove(styles.hide_cross_icon);
      crossIconRef.current.classList.add(styles.show_cross_icon);
    } else if (
      newValue === "" &&
      crossIconRef.current.classList == styles.show_cross_icon
    ) {
      crossIconRef.current.classList.remove(styles.show_cross_icon);
      crossIconRef.current.classList.add(styles.hide_cross_icon);
    }
  };

  const delayedSearch = debounce(changeInputValue, 300);

  const clearInputValue = () => {
    setInputValue("");
    inputRef.current.value = "";
    crossIconRef.current.classList.remove(styles.show_cross_icon);
    crossIconRef.current.classList.add(styles.hide_cross_icon);
  };

  const updateURLParams = (key, value) => {
    let genre='', year='', title=''
    if(router.query.id) [ genre, year, title ] = router.query.id.split('+')  
    
    let str = `/genreYearTitle/${genre}+${year}+${value}`
   
    router.push(str, '', { shallow: true });
  };

  return (
    <div className={styles.search_block}>
      <Image src={searchIcon} alt="" className={styles.search_icon} />
      <input
        className={styles.seach_input}
        placeholder={inputValue ? inputValue : "Название фильма"}
        onChange={(e) => delayedSearch(e)}
        ref={inputRef}
      />
      <Image
        src={crossIcon}
        alt=""
        className={styles.hide_cross_icon}
        ref={crossIconRef}
        onClick={clearInputValue}
      />
    </div>
  );
};

export default SearchPanel;
