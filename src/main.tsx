import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// 테마 불러오기 (localStorage에서 가져와서 설정)
const savedTheme = localStorage.getItem("theme");
if (savedTheme && savedTheme !== "default") {
  document.documentElement.setAttribute("data-theme", savedTheme);
} else {
  document.documentElement.removeAttribute("data-theme");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);