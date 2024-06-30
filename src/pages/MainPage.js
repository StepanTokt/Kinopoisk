import styles from '../styles/MainPage.module.css'
import SearchPanel from '../components/searchPanel/SearchPanel'
import FilterPanel from '../components/filterPanel/FilterPanel';
import FilmList from '../components/filmList/FilmList';

const MainPage = ()=>{


	return (
    <div className={styles.main_block}>
      <div className={styles.left_block}>
		<FilterPanel/>
	  </div>
      <div className={styles.right_block}>
        <SearchPanel />
        <FilmList/>
      </div>
    </div>
  );
}

export default MainPage