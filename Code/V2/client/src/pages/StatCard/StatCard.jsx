import React from "react";
import styles from "./StatCard.module.css";

const StatCard = ({ title, value }) => {
  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

export default StatCard;