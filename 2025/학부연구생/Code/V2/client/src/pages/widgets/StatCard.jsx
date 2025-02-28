import React from "react";

const StatCard = ({ title, value }) => {
  return (
    <div style={{ padding: "10px", border: "1px solid #ddd", margin: "10px 0" }}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

export default StatCard;