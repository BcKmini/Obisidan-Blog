import React from "react";

const Notification = ({ message }) => {
  return (
    <div style={{ padding: "10px", border: "1px solid #ddd", margin: "10px 0" }}>
      <p>{message}</p>
    </div>
  );
};

export default Notification;