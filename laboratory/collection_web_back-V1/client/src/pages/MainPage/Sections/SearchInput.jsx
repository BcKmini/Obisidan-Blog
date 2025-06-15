import React from "react";
import "./../../../style/main.css"

const SearchInput = ({ onSearch, searchTerm }) => {
    return (
        <div>
            <input
                className="searchinput"
                type="text"
                placeholder="검색할 생물의 이름(국명 또는 학명)을 입력하세요"
                onChange={onSearch}
                value={searchTerm}
            />
        </div>
    );
};

export default SearchInput;