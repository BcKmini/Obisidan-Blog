import styles from "./page.module.css";
import React from "react";
import Footer from "../../layout/Footer/footer";
import Main from "./main";
import { GoMoveToTop } from "react-icons/go";

const MainPage = () => {

    return (
        <div className={styles.container}>
          <div className={styles.mainContainer}>
            <Main/>
            <Footer/>
          </div>

          <a href="#top" className={styles.topButton}>
            <GoMoveToTop fontSize={16} fontWeight={900}/>
          </a>

        </div>
      )
};
  
export default MainPage;
