import React, { useEffect, useRef } from "react";
import "./Map.css";

export default function Map() {
    const svgContainer = useRef(null);

    useEffect(() => {
        // SVG 파일을 동적으로 로드
        fetch("/img/south-korea.svg")
            .then((response) => response.text())
            .then((svgContent) => {
                if (svgContainer.current) {
                    svgContainer.current.innerHTML = svgContent;
                }
            })
            .catch((err) => console.error("Failed to load SVG:", err));
    }, []);

    return (
        <div className="map-container">
            {/* 동적으로 로드된 SVG가 삽입될 영역 */}
            <div ref={svgContainer} className="svg-wrapper" />
        </div>
    );
}
