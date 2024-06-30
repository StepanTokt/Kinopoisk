import './MainPage.css'
import SearchPanel from '../searchPanel/SearchPanel'
import FilterPanel from '../filterPanel/FilterPanel';
import FilmList from '../filmList/FilmList';

const MainPage = ()=>{


	return (
    <div className="main_block">
      <div className="left_block">
		<FilterPanel/>
	  </div>
      <div className="right_block">
        <SearchPanel />
        <FilmList/>
      </div>
    </div>
  );
}

export default MainPage