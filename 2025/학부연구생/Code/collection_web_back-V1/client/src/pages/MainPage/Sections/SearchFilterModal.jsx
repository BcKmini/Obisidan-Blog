import React from "react";
import "./../../../style/SearchFilterModal.css"

const SearhFilterModal = ({ onClose }) => {
    const hadleClickInside = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="search_filter_modal" onClick={onClose}>
            <div className="modalContent" onClick={hadleClickInside}>
                <h3>생물 분류 선택</h3>
                <button onClick={() => console.log("조류")}>조류</button>
                <button onClick={() => console.log("포유류")}>포유류</button>
                <button onClick={() => console.log("어류")}>어류</button>

                <h3>서식지 유형 선택</h3>
                <button onClick={() => console.log("숲")}>숲</button>
                <button onClick={() => console.log("강가")}>강가</button>
                <button onClick={() => console.log("습지")}>습지</button>
                <button onClick={() => console.log("도시")}>도시</button>
            </div>
        </div>
    );
};

export default SearhFilterModal;