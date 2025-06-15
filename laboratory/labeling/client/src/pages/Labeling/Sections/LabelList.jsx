import React, { useState } from "react";
import "./stylesheet/LabelList.css";

const LabelList = ({ boundingBoxes, deleteBox, classMap, addClass, removeClass, handleSaveAndExit }) => {
  const [newClassName, setNewClassName] = useState("");

  return (
    <div className="label-list-box">
      <h3>라벨 목록</h3>
      <ul>
        {boundingBoxes.map((box, index) => (
          <li key={box.id}>
            {/* ID: {box.id}, Class: {box.class_id} */}
            Class: {box.class_id}
            <button className="label-delete-btn" onClick={() => deleteBox(index)}>X</button>
          </li>
        ))}
      </ul>

      {/* 클래스 설정 UI 추가 (하단) */}
      <div className="class-selector-container">
        <h4>클래스 설정</h4>
        <ul className="class-list">
          {classMap.map((cls) => (
            <li key={cls.id} className="class-item">
              <span>{cls.id}: {cls.name}</span>
              <button className="class-delete-btn" onClick={() => removeClass(cls.id)}>삭제</button>
            </li>
          ))}
        </ul>

        <div className="class-add">
          <input
            type="text"
            placeholder="새 클래스 이름"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
          />
          <button
            onClick={() => {
              if (newClassName.trim()) {
                addClass(newClassName.trim());
                setNewClassName("");
              }
            }}
          >
            추가
          </button>
        </div>
      </div>
      {/* 저장 및 종료 버튼 추가 */}
      <div className="save-exit-panel">
        <button onClick={() => handleSaveAndExit(false, 0)}>저장 및 종료</button>
        <button
          onClick={async () => {
            let input = window.prompt("사용할 class id를 숫자로 입력하세요", '0')
            let customId = 0;
            if (input !== null) {
              customId = parseInt(input, 10)
              if (isNaN(customId)) {
                alert("유효한 숫자를 입력해주세요. 기본값은 0을 사용합니다.")
                customId = 0
              }
            }
            await handleSaveAndExit(true, customId)
          }}
        >
          클래스 저장
        </button>
      </div>
    </div>
  );
};

export default LabelList;