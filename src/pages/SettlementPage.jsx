import React, { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { ReceiptContext } from "../context/ReceiptContext"; // ReceiptContext를 불러옴
import Receipt from "../components/MainReceipt";
import SelectedItems from "../components/SelectedItems";
import Members from "../components/Members";
import ImageModal from "../components/ImageModal";

import "./SettlementPage.css";

const SettlementPage = () => {
    // Context에서 방 정보 및 영수증 데이터를 불러옴
    const { rooms } = useContext(ReceiptContext);
    const { roomId } = useParams(); // URL에서 roomId를 받아옴
    const location = useLocation();
    const room = rooms.find((room) => room.roomId === roomId); // rooms 배열에서 roomId가 일치하는 방을 찾음
    const receiptData = room ? room.receiptData : []; // 해당 방의 영수증 데이터를 가져옴

    const [isLoadingReceipt, setIsLoadingReceipt] = useState(false); // 영수증 로딩 상태
    const [isLoadingImage, setIsLoadingImage] = useState(true); // 이미지 로딩 상태
    const [receiptItems, setReceiptItems] = useState(receiptData[0]?.items || []);

    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [currentReceiptIndex, setCurrentReceiptIndex] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const [members, setMembers] = useState([
        { name: "김승연", status: "완료" },
        { name: "임지인", status: "진행중" },
        { name: "조경재", status: "진행중" },
        { name: "정우석", status: "완료" },
        { name: "홍민혁", status: "진행중" },
    ]);
    const [isModalImgActive, setIsModalImgActive] = useState(false);
    const [modalImage, setModalImage] = useState(null);

    // 항목을 선택하여 리스트로 이동시키는 함수
    const handleSelectItem = (item) => {
        const existingItem = selectedItems.find((selected) => selected.name === item.name);

        if (existingItem) {
            setSelectedItems((prevItems) => prevItems.map((selected) => (selected.name === item.name ? { ...selected, quantity: selected.quantity + 1 } : selected)));
        } else {
            const validItem = { name: item.name, price: item.price, quantity: 1 };
            setSelectedItems((prevItems) => [...prevItems, validItem]);
        }

        setReceiptItems((prevItems) => prevItems.map((receiptItem) => (receiptItem.name === item.name ? { ...receiptItem, quantity: receiptItem.quantity - 1 } : receiptItem)));
    };

    // 영수증 항목 수정 후 저장
    const handleSaveItem = (updatedItem) => {
        setReceiptItems((prevItems) => prevItems.map((item) => (item.name === updatedItem.name ? { ...updatedItem } : item)));
    };

    // 선택된 항목 제거
    const handleRemoveItem = (indexToRemove) => {
        const itemToRemove = selectedItems[indexToRemove];

        if (itemToRemove.quantity > 1) {
            setSelectedItems((prevItems) => prevItems.map((item, index) => (index === indexToRemove ? { ...item, quantity: item.quantity - 1 } : item)));
        } else {
            setSelectedItems((prevItems) => prevItems.filter((_, index) => index !== indexToRemove));
        }

        setReceiptItems((prevItems) => prevItems.map((receiptItem) => (receiptItem.name === itemToRemove.name ? { ...receiptItem, quantity: receiptItem.quantity + 1 } : receiptItem)));
    };

    // 선택된 항목들의 총 금액 계산
    const totalAmount = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);

    // 모든 영수증의 총 금액 계산
    const totalAmountGrand = receiptData.reduce((total, receipt) => {
        const receiptTotal = receipt.items.reduce((subTotal, item) => subTotal + item.price * item.quantity, 0);
        return total + receiptTotal;
    }, 0);

    // 멤버 상태 변경
    const toggleStatus = (index) => {
        setMembers((prevMembers) => prevMembers.map((member, i) => (i === index ? { ...member, status: member.status === "완료" ? "진행중" : "완료" } : member)));
    };

    // 정산 완료 처리
    const completeSettlement = () => {
        setMembers((prevMembers) => prevMembers.map((member) => (member.status === "진행중" ? { ...member, status: "완료" } : member)));
    };

    // 영수증 이미지 클릭 시 해당 영수증으로 이동
    const handleImageClick = (index) => {
        setCurrentReceiptIndex(index);
        setReceiptItems(receiptData[index]?.items || []);
    };

    // 이미지 더블 클릭 시 모달 열기
    const handleImageDoubleClick = (index) => {
        setModalImage(receiptData[index].image);
        setIsModalImgActive(true);
    };

    // 링크 복사 기능
    const handleCopyLink = (e) => {
        const currentUrl = window.location.href;
        navigator.clipboard
            .writeText(currentUrl)
            .then(() => {
                setTooltipPosition({ x: e.clientX, y: e.clientY });
                setIsTooltipVisible(true);
                setTimeout(() => {
                    setIsTooltipVisible(false);
                }, 2000);
            })
            .catch((err) => {
                console.error("링크 복사 실패:", err);
            });
    };

    return (
        <div className="settlement-page">
            <div className="header-section">
                <div className="title">PayDay</div>
                <div className="total-amount">총 금액: {totalAmountGrand.toLocaleString()}원</div>
                <div className="image-preview-list">
                    {receiptData.map((image, index) => (
                        <img
                            key={index}
                            src={image.image}
                            alt={`영수증 예시 ${index + 1}`}
                            onClick={() => handleImageClick(index)}
                            onDoubleClick={() => handleImageDoubleClick(index)}
                            className={`preview-image ${currentReceiptIndex === index ? "selected" : ""}`}
                        />
                    ))}
                </div>
                <button className="link-copy" onClick={handleCopyLink}>
                    링크 복사
                </button>
                {isTooltipVisible && (
                    <div className="link-tooltip" style={{ left: `${tooltipPosition.x}px`, top: `${tooltipPosition.y}px` }}>
                        링크가 복사되었습니다!
                    </div>
                )}
            </div>

            <div className="main-content">
                <span className="content-index">{currentReceiptIndex + 1}</span>
                {isLoadingReceipt ? (
                    <div className="content-container">영수증 데이터를 불러오는 중...</div>
                ) : (
                    <>
                        <Receipt receiptItems={receiptItems} receiptData={receiptData[currentReceiptIndex]} onItemSelect={handleSelectItem} />
                    </>
                )}

                <div className="content-container">
                    <Members members={members} toggleStatus={toggleStatus} />
                    <SelectedItems selectedItems={selectedItems} totalAmount={totalAmount} onRemoveItem={handleRemoveItem} />
                    <div className="button-group">
                        <button onClick={completeSettlement}>나머지 금액은 1/N으로</button>
                        <button onClick={completeSettlement}>정산 완료</button>
                    </div>
                </div>
            </div>

            {isModalImgActive && <ImageModal src={modalImage} onClose={() => setIsModalImgActive(false)} />}
        </div>
    );
};

export default SettlementPage;
