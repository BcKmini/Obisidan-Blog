import React from "react";
import "./../../../style/CardItem.css"

const CardItem = () => {
    return (
        <div className="cardItem_grid_container">
            <div className="cardItem_background">
                <div className="cardItem image">image</div>
                <div className="cardItem count">count</div>
                <div className="cardItem info">
                    <div>title</div>
                    <div>location</div>
                </div>
                <div className="cardItem user">
                    <div className="cardItem profile"></div>
                    <div className="cardItem user_info">
                        <div>이름</div>
                        <div>작성일</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardItem;