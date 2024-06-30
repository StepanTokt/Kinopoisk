import "./App.css";
import Header from "./components/header/Header";
import MainPage from "./components/mainPage/MainPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FilmPage from "./components/filmPage/FilmPage";
import AuthorizedPopUp from "./components/authorizedPopUp/authorizedPopUp";
import { useState } from "react";
import { createPortal } from "react-dom";

function App() {
  const [modalActive, setModalActive] = useState(false);
  return (
    <Router>
      <>
        <Header active={modalActive} setActive={setModalActive} />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/film/:id" element={<FilmPage />} />
        </Routes>

        {createPortal(
          <AuthorizedPopUp active={modalActive} setActive={setModalActive} />,
          document.body
        )}
      </>
    </Router>
  );
}

export default App;
