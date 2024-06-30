import "./Stars.css";
import { useEffect, useState } from "react";
import { useGetMovieByIdQuery } from "../../logic/api/apiSlice";
import { useRateMovieMutation } from '../../logic/api/apiUsers';

const Stars = ({ id, refetch }) => {
  const [starsValue, setStarsValue] = useState([1, 2, 3, 4, 5]);
  const [isClicked, setIsClicked] = useState(false);
  const [rating, setRating] = useState(0);
  const [constRating, setConstRating] = useState(() => {
    const marks = JSON.parse(localStorage.getItem('marks')) || {};
    return marks[id] || 0;
  });

  const [loginUser, { isLoading, isFetching, isError }] = useRateMovieMutation();

  const { data: film = {} } = useGetMovieByIdQuery(id);

  // Функция debounce для задержки установки constRating
  let timeoutId;

  const debounceSetConstRating = (value) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      setConstRating(value);

      const marks = JSON.parse(localStorage.getItem('marks')) || {};
      marks[id] = value;
      localStorage.setItem('marks', JSON.stringify(marks));

      sendRequest();
    }, 300); 
  };

  const sendRequest = async () => {
    const marks = JSON.parse(localStorage.getItem('marks')) || {};
    const value = marks[id];
    if (value !== constRating) {
      const token = localStorage.getItem('token');
      const { data } = await loginUser({ movieId: id, user_rate: value, token });
      if (refetch != null) refetch();
    }
  };

  useEffect(() => {
    if (film) {
      const marks = JSON.parse(localStorage.getItem('marks')) || {};
      setRating(marks[id] || 0);
    }
  }, [film, id]);

  const handleMouseOver = (index) => {
    if (localStorage.getItem('token')) {
      if (constRating < index + 1) setRating(index);
    }
  };

  const handleClick = (index) => {
    if (localStorage.getItem('token')) {
      setRating(index);
      debounceSetConstRating(index); // Используем debounce для установки constRating
      setIsClicked(true);
    }
  };

  const handleMouseOut = () => {
    if (localStorage.getItem('token')) {
      setRating(constRating);
    }
  };

  return (
    <div className="rating_panel">
      {starsValue.map((starValue, index) => {
        const starIndex = index + 1;
        return (
          <div className="rating_block" key={starIndex}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`star_icon ${rating >= starIndex && rating > constRating  ? 'active_hover' : rating >= starIndex ? 'active_click' : ''}`}
              onMouseOver={() => handleMouseOver(starIndex)}
              onMouseOut={isClicked ? handleMouseOut : handleMouseOut}
              onClick={(e) => {
                e.stopPropagation();
                handleClick(starIndex);
              }}
              class="bi bi-star-fill star_icon"
              viewBox="0 0 16 16"
            >
              <path
                d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
              />
            </svg>
            <p className={`${starValue<= rating && rating <= constRating ? "active_rating" : "rating"}`}>{starValue}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Stars;
