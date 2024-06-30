import "@/styles/globals.css";
import { Provider } from "react-redux";
import store from "@/components/store";
import Header from "@/components/header/Header";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import AuthorizedPopUp from "@/components/authorizedPopUp/authorizedPopUp";

export default function App({ Component, pageProps }) {
  const [modalActive, setModalActive] = useState(false);

  useEffect(() => {
    // Проверяем, что document определен перед использованием createPortal
    if (modalActive) {
      const portalRoot = document.getElementById("portal-root");
      if (portalRoot) {
        portalRoot.innerHTML = ""; // Очищаем содержимое, если необходимо
        portalRoot.appendChild(document.createElement("div"));
      }
    }
  }, [modalActive]);

  return (
    <Provider store={store}>
      <Header active={modalActive} setActive={setModalActive} />
      <Component {...pageProps} />

      {modalActive && createPortal(
        <AuthorizedPopUp active={modalActive} setActive={setModalActive} />,
        document.getElementById("portal-root") || document.body
      )}
    </Provider>
  );
}
