import './SearchPanel.css'
import searchIcon from '../../resources/search-icon.svg'
import crossIcon from '../../resources/cross-icon.svg'
import { useState,useRef, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

const SearchPanel =()=>{

	const [inputValue, setInputValue] = useState('');
	const crossIconRef = useRef(null)
	const inputRef = useRef(null)

  const navigate = useNavigate();
  const location = useLocation();
	
	const debounce = (func, delay)=>{
		let timer
		return (...args)=>{
			clearTimeout(timer)
			timer = setTimeout(()=>{
				func.apply(this, args)
			}, delay)
		}
	}

	const changeInputValue = (e) => {
    let newValue = e.target.value.trim();
    setInputValue(newValue);
    updateURLParams('title', newValue);
    if (newValue !== "") {
      crossIconRef.current.classList.remove("hide_cross_icon");
      crossIconRef.current.classList.add("show_cross_icon");
    } else if (
      newValue === "" &&
      crossIconRef.current.classList == "show_cross_icon"
    ) {
      crossIconRef.current.classList.remove("show_cross_icon");
      crossIconRef.current.classList.add("hide_cross_icon");
    }
  };

	const delayedSearch = debounce(changeInputValue, 300)

	

	const clearInputValue = ()=>{
		setInputValue('')
		inputRef.current.value = ''
		crossIconRef.current.classList.remove("show_cross_icon");
    	crossIconRef.current.classList.add("hide_cross_icon");
	}


  const updateURLParams = (key, value) => {
    const params = new URLSearchParams(location.search);
    if (value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    navigate({ search: params.toString() });
  };



	return (
    <div className="search_block">
      <img src={searchIcon} alt="" className="search_icon" />
      <input
        className="seach_input"
        placeholder="Название фильма"
        onChange={(e) => delayedSearch(e)}
		ref = {inputRef}
      />
      <img src={crossIcon} alt="" className="hide_cross_icon" ref={crossIconRef} onClick={clearInputValue} />
    </div>
  );
}

export default SearchPanel