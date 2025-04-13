import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import Footer from "../../layout/Footer/footer";
import SocialCard from "./card";
import Button from "./Button";
import { IoSearch } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();
  // 관찰 데이터를 저장할 상태
  const [observations, setObservations] = useState([]);

  useEffect(() => {
    const fetchObservations = async () => {
      try {
        const response = await axios.get("http://localhost:4000/observations");
        // 응답 데이터가 배열형식이고, created_at을 기준으로 내림차순 정렬
        const sortedData = response.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setObservations(sortedData);
      } catch (error) {
        console.error("관찰 데이터 가져오기 오류:", error);
      }
    };
    fetchObservations();
  }, []);

  const handleClick = () => {
    navigate("/upload");
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        <section id="top" className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <div className="flex justify-between w-full">
              <div className="buttons flex gap-5">
                <Button label="전체" />
                <Button label="식물" />
                <Button label="동물" />
                <Button label="곤충" />
                <Button label="기타" />
              </div>
              <div className={styles.searchBar1}>
                <span style={{ padding: "8px 6px 6px 14px" }}>
                  <IoSearch fontSize={18} color="#758C80" />
                </span>
                <input
                  type="text"
                  placeholder="원하는 생물의 이름을 입력해주세요."
                  className={styles.searchInput}
                />
              </div>
            </div>
            <div
              className="min-w-[120px] h-[38px] flex items-center justify-center gap-2 px-[18px] bg-[#758C80] text-white rounded-md cursor-pointer"
              onClick={handleClick}
            >
              <CiEdit fontSize={24} />
              <span>기록</span>
            </div>
          </div>
        </section>

        {/* Observation Grid - 가로 4개씩 배치 */}
        <main className={styles.main}>
          <div className={styles.observationGrid}>
            {observations.map((obs) => (
              <SocialCard key={obs.id} observation={obs} />
            ))}
          </div>
        </main>
        <Footer />
      </div>
      <a href="#top" className={styles.topButton}>
        {/* 위로 가기 버튼 */}
        <span style={{ fontSize: 16, fontWeight: 900 }}>▲</span>
      </a>
    </div>
  );
};

export default MainPage;
