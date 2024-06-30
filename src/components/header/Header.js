import { useEffect, useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import avatar from '../../resources/person.png';
const Header = ({ active, setActive }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [localStorage.getItem('token')])

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.reload();
  };

  const handleLogin = () => {
    setActive(true); // Показать модальное окно для входа
  };

  return (
    <div className="header">
      <Link to="/" className="link">
        <div className="site_name">Фильмопоиск</div>
      </Link>
      {isLoggedIn ? (
        
        <div className='close_header'>
          <div className='circle'>
            <img src={avatar} alt="" />
          </div>
          <button className="close_button" onClick={handleLogout}>
          Выйти
          </button>
        </div>
        
      ) : (
        <button className="enter_button" onClick={handleLogin}>
          Войти
        </button>
      )}
    </div>
  );
};

export default Header;
