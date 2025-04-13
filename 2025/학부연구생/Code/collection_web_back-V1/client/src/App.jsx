// src/App.jsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import './App.css';
import MainPage from './pages/MainPage';
import Header from "./layout/Header/Header";
import UploadPage from "./pages/UploadPage";
// DetailPage(= DetailPostPage) - 이름 혼동 없이 하나만 사용
import DetailPage from "./pages/DetailsPage";

function Layout({ children }) {
  return (
    <div className="layout">
      <main>{children}</main>
    </div>
  );
}

const App = () => {
  return (
    <Layout>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/details/:id" element={<DetailPage />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
