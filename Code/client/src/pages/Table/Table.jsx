import React from "react";
import styles from "./Table.module.css";

const Table = ({ data, columns, title }) => {
  if (!data || !columns) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {title && <h2 className={styles.tableTitle}>{title}</h2>} {/* 제목 추가 */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col}>{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;