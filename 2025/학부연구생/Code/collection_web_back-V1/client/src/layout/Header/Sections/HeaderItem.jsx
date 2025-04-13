import React from "react";
import { Link } from "react-router-dom";
import styles from "./HeaderItem.module.css";
import logo from "/src/assets/logo.png";
import { GoBell } from "react-icons/go";

const HeaderItem = () => {
  return (
    <div style={{ display: "flex", alignItems: "center", backgroundColor: "#0e1b0f", height: "130px" }}>
      
      <Link to="/" className={styles.logoArea} style={{ textDecoration: "none" }}>
        <img src={logo} alt="로고" className={styles.logoImg} />
        <div className={styles.logoText}>
          <div style={{ fontWeight: "bold", fontSize: "25px", color: "white" }}>
            AI융합연구센터
          </div>
          <div style={{ color: "#aaa", fontSize: "15px" }}>
            야생동물 데이터 수집
          </div>
        </div>
      </Link>

      <nav className={styles.headerNav}>
        <Link to="/" className={styles.navItem}>관찰하기</Link>
        <Link to="/" className={styles.navItem}>참여하기</Link>
        <Link to="/" className={styles.navItem}>소통하기</Link>
        <Link to="/" className={styles.navItem}>통계보기</Link>
      </nav>

      <div className={styles.rightArea}>
        <Link to="/mypage">
          <img src="https://placehold.co/32x32" alt="profile" className={styles.profileImg} />
        </Link>
        <Link to="/mypage" style={{ color: "white", fontSize: "14px", fontWeight: "500" }}>마이페이지</Link>
        <GoBell color="white" size={20} />
      </div>
    </div>
  );
};

export default HeaderItem;
