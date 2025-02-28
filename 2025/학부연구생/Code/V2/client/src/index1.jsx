import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Map from "./pages/Map/Map"; // 수정된 경로
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
        <Map />
    </React.StrictMode>
   
);
