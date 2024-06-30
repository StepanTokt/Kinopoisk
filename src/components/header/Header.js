import { useEffect, useState } from 'react';
import Image from "next/image";
import styles from '../../styles/Header.module.css';
import Link from 'next/link';
import avatar from '../../../public/person.png';
import { activeGenreChanged, activeYearChanged } from "../actions/actions";
import { useSelector, useDispatch } from "react-redux";

const Header = ({ active, setActive }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    setIsLoggedIn(false); 
    window.location.reload();
   
  };

  const handleLogin = () => {
    setActive(true); 
  };

  const handleClearDispatch = () => {
    dispatch(activeGenreChanged('Не выбран'));
    dispatch(activeYearChanged('Не выбран'));
  }

  return (
    <div className={styles.header}>
      <Link href="/" className={styles.link} onClick={handleClearDispatch}>
        <div className={styles.site_name}>Фильмопоиск</div>
      </Link>
      {isLoggedIn ? (
        <div className={styles.close_header}>
          <div className={styles.circle}>
            <Image src={avatar} alt="" />
          </div>
          <button className={styles.close_button} onClick={handleLogout}>
            Выйти
          </button>
        </div>
      ) : (
        <button className={styles.enter_button} onClick={handleLogin}>
          Войти
        </button>
      )}
    </div>
  );
};

export default Header;
