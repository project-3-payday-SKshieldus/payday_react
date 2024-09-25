import React, { useEffect, useState } from "react";
import "./SettlementPage.css";
import receipt1 from "../assets/영수증_예시1.png";
import receipt2 from "../assets/영수증_예시2.png";
import receipt3 from "../assets/영수증_예시3.png";
import receipt4 from "../assets/영수증_예시4.png";

const SettlementPage = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(1); // 이미지 번호
    const [isModalImgActive, setIsModalImgActive] = useState(false); // 모달 활성화 상태

    const receiptImages = [receipt1, receipt2, receipt3, receipt4];


    // 이미지 클릭 시 번호 변경
    const handleImageClick = (index) => {
        setCurrentImageIndex(index);
        // 해당 이미지에 맞는 영수증 항목을 가져오는 로직
    };

    // 이미지 더블 클릭 시 모달 열기
    const handleImageDoubleClick = () => {
        setIsModalImgActive(true); // 모달 활성화
    };

    // 모달 닫기 함수
    const closeModal = () => {
        setIsModalImgActive(false); // 모달 비활성화
    };

    useEffect(() => {
        const html = document.documentElement;
        if (isModalImgActive) {
            html.style.overflowY = "hidden";
            html.style.overflowX = "hidden";
        } else {
            html.style.overflowY = "auto";
            html.style.overflowX = "auto";
        }
        return () => {
            html.style.overflowY = "auto";
            html.style.overflowX = "auto";
        };
    }, [isModalImgActive]);

    // 모달 컴포넌트
    const Modal = ({ src, onClose }) => (
        <div className="modal-overlay">
        <div className="modal-content">
            <img src={src} alt="영수증 이미지" style={{ width: '700px', height: '700px' }} />
            <button onClick={onClose} style={{ margin: '10px' }}>닫기</button>
        </div>
        </div>
    );

    return (
        <div className="settlement-page">
            {/* 제목, 총 금액, 이미지 프리뷰, 링크 복사 */}
            <div className="header-section">
                <div className="title">PayDay</div>
                <div className="total-amount">전체 총액: 88,300원</div>

                <div className="image-preview-list">
                    {/* 배열을 사용하여 동적으로 이미지를 렌더링 */}
                    {receiptImages.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`영수증 예시 ${index + 1}`}
                            onClick={() => handleImageClick(index)}
                            onDoubleClick={handleImageDoubleClick} // 더블클릭 이벤트로 모달 활성화
                            className={`preview-image ${currentImageIndex === index ? "selected" : ""}`}
                        />
                    ))}
                </div>

                <button className="link-copy">링크 복사</button>

                {/* 모달이 활성화되면 모달 컴포넌트를 렌더링 */}
                {isModalImgActive && currentImageIndex !== null && (
                    <Modal
                        src={receiptImages[currentImageIndex]} // 현재 선택된 이미지
                        onClose={closeModal} // 닫기 버튼 누르면 모달 닫힘
                    />
                )}
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
