import React, { useState } from "react";
import receipt1 from "../assets/영수증_예시1.png";
import receipt2 from "../assets/영수증_예시2.png";
import receipt3 from "../assets/영수증_예시3.png";
import "./timeline.css";

// 좌표는 선택 확인용 -> 나중에 지워야함
const receiptData = [
    {
        image: receipt1,
        storeName: "단토리",
        date: "2024/06/19 19:08",
        address: "서울 강서구 공항대로 247",
        items: [
            { name: "공깃밥", price: 3000, quantity: 3 },
            { name: "코크 하이볼", price: 3900, quantity: 1 },
            { name: "토마토 하이볼", price: 5900, quantity: 1 },
            { name: "파인애플 하이볼", price: 10900, quantity: 1 },
            { name: "명란계란말이", price: 6900, quantity: 1 },
            { name: "아기소바", price: 8900, quantity: 1 },
        ],
        mapCoords: { lat: 37.5585, lng: 126.8375 },
    },
    {
        image: receipt2,
        storeName: "초밥천국",
        date: "2024/06/15 18:45",
        address: "서울 마포구 양화로 123",
        items: [
            { name: "초밥 세트", price: 15000, quantity: 2 },
            { name: "사케", price: 12000, quantity: 1 },
            { name: "우동", price: 7000, quantity: 1 },
            { name: "튀김", price: 8000, quantity: 1 },
        ],
        mapCoords: { lat: 37.5547, lng: 126.9138 },
    },
    {
        image: receipt3,
        storeName: "치킨마을",
        date: "2024/07/01 20:30",
        address: "서울 강남구 테헤란로 45",
        items: [
            { name: "치킨", price: 18000, quantity: 1 },
            { name: "맥주", price: 4000, quantity: 2 },
            { name: "감자튀김", price: 5000, quantity: 1 },
        ],
        mapCoords: { lat: 37.5091, lng: 127.0628 },
    },
];

const Timeline = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // 영수증 선택 시 상태 업데이트
    const handleImageClick = (index) => {
        setCurrentImageIndex(index); // 선택된 영수증 이미지 업데이트
    };

    const selectedReceipt = receiptData[currentImageIndex];

    return (
        <div className="timeline-page">
            <div className="header-section">
                <div className="title">PayDay</div>
                <div className="image-preview-list">
                    {receiptData.map((receipt, index) => (
                        <img
                            key={index}
                            src={receipt.image}
                            alt={`영수증 예시 ${index + 1}`}
                            onClick={() => handleImageClick(index)}
                            className={`preview-image ${
                                currentImageIndex === index ? "selected" : ""
                            }`}
                        />
                    ))}
                </div>
            </div>

            <div className="map-section">
                <div className="map-block">
                    <div className="map-placeholder">
                        <ul>
                            {receiptData.map((receipt, index) => (
                                <li
                                    key={index}
                                    style={{
                                        color:
                                            currentImageIndex === index
                                                ? "blue"
                                                : "black",
                                    }}
                                >
                                    {receipt.storeName} -{" "}
                                    {receipt.mapCoords.lat},{" "}
                                    {receipt.mapCoords.lng}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Timeline;
