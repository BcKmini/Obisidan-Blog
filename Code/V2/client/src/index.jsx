import React from "react";
import ReactDOM from "react-dom/client"; // ReactDOM 대신 ReactDOMClient
import App from "./App";
import "./index.css";

// React 18의 createRoot 사용
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);