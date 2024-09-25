import React, { useState } from "react";
import "./SettlementPage.css";
import receipt1 from "../assets/영수증_예시1.png";
import receipt2 from "../assets/영수증_예시2.png";
import receipt3 from "../assets/영수증_예시3.png";
import receipt4 from "../assets/영수증_예시4.png";

const SettlementPage = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(1); // 이미지 번호

    // 이미지 클릭 시 번호 변경
    const handleImageClick = (index) => {
        setCurrentImageIndex(index);
        // 해당 이미지에 맞는 영수증 항목을 가져오는 로직
    };
    const handleImageDoubleClick = () => {
        alert(`이미지 ${currentImageIndex} 클릭`);
    };

    return (
        <div className="settlement-page">
            {/* 제목, 총 금액, 이미지 프리뷰, 링크 복사 */}
            <div className="header-section">
                <div className="title">PayDay</div>
                <div className="total-amount">전체 총액: 88,300원</div>

                {/* 예시 데이터 넣으려고 잠깐 이렇게 했습니다*/}
                <div className="image-preview-list">
                    <img
                        src={receipt1}
                        alt="영수증 예시 1"
                        onClick={() => handleImageClick(1)}
                        onDoubleClick={handleImageDoubleClick}
                        className={`preview-image ${currentImageIndex === 1 ? "selected" : ""}`}
                    />
                    <img
                        src={receipt2}
                        alt="영수증 예시 2"
                        onClick={() => handleImageClick(2)}
                        onDoubleClick={handleImageDoubleClick}
                        className={`preview-image ${currentImageIndex === 2 ? "selected" : ""}`}
                    />
                    <img
                        src={receipt3}
                        alt="영수증 예시 3"
                        onClick={() => handleImageClick(3)}
                        onDoubleClick={handleImageDoubleClick}
                        className={`preview-image ${currentImageIndex === 3 ? "selected" : ""}`}
                    />
                    <img
                        src={receipt4}
                        alt="영수증 예시 4"
                        onClick={() => handleImageClick(4)}
                        onDoubleClick={handleImageDoubleClick}
                        className={`preview-image ${currentImageIndex === 4 ? "selected" : ""}`}
                    />
                </div>

                <button className="link-copy">링크 복사</button>
            </div>

            {/* 영수증, 정산 처리를 위한 블록, member state, button-group */}
            <div className="main-content">
                <div className="receipt-block">
                    <div className="receipt-title">단토리</div>
                    <div className="receipt-content">
                        <div>공깃밥</div>
                        <div>코크 하이볼</div>
                    </div>
                </div>

                <div className="sidebar">
                    <div className="member-status">
                        {/* h4 지우고 각 member - state 쌍으로 표현하면 좋을 것 같습니다.*/}
                        <h4>멤버 상태</h4>
                        {/* 멤버 상태 컴포넌트 */}
                    </div>

                    <div className="selected-items">
                        <h4>내가 선택한 항목</h4>
                        {/* 선택 항목 받아오기 */}
                    </div>

                    <div className="button-group">
                        {/* 버튼에 링크 부여 */}
                        <button>타임라인 보기</button>
                        <button>나머지 금액은 1/N으로</button>
                        <button>정산 완료</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettlementPage;
