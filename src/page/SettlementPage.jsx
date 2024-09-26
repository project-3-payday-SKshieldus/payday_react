import React, { useState } from "react";
import "./SettlementPage.css";
import receipt1 from "../assets/영수증_예시1.png";
import receipt2 from "../assets/영수증_예시2.png";
import receipt3 from "../assets/영수증_예시3.png";
import EditModal from "../components/EditModal"; // EditModal 가져오기
import ImageModal from "../components/ImageModal"; // ImageModal 가져오기

const getStatusStyle = (status) => {
    switch (status) {
        case "완료":
            return { backgroundColor: "rgba(0, 255, 0, 1)" }; // 초록색
        case "진행중":
            return { backgroundColor: "rgba(255, 165, 0, 0.7)" }; // 주황색
        case "미실시":
            return { backgroundColor: "rgba(128, 128, 128, 0.3)" }; // 회색
        default:
            return { backgroundColor: "rgba(128, 128, 128, 0.3)" }; // 기본값 (회색)
    }
};


// 실제 데이터 전송 받은 후에는 데이터 실시간 처리해서 데이터베이스에서도 지워지게 해야함..
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
    },
];

const SettlementPage = () => {
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const [currentReceiptIndex, setCurrentReceiptIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isModalImgActive, setIsModalImgActive] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [receiptItems, setReceiptItems] = useState(receiptData[currentReceiptIndex].items);

    const [members, setMembers] = useState([
        { name: "김승연", status: "완료" },
        { name: "임지인", status: "진행중" },
        { name: "조경재", status: "진행중" },
        { name: "정우석", status: "완료" },
        { name: "홍민혁", status: "진행중" },
    ]);
    const currentReceipt = receiptData[currentReceiptIndex];

    //총 금액 계산
    const totalReceiptAmount = currentReceipt.items.reduce((acc, item) => acc + item.price * item.quantity, 0).toLocaleString();

    // 항목을 선택하여 선택된 항목 리스트로 이동시키는 함수
    const handleSelectItem = (item) => {
        if (item.quantity > 0) {
            const existingItem = selectedItems.find((selected) => selected.name === item.name);

            if (existingItem) {
                setSelectedItems((prevItems) => prevItems.map((selected) => (selected.name === item.name ? { ...selected, quantity: selected.quantity + 1 } : selected)));
            } else {
                setSelectedItems((prevItems) => [...prevItems, { ...item, quantity: 1 }]);
            }

            setReceiptItems((prevItems) => prevItems.map((receiptItem) => (receiptItem.name === item.name ? { ...receiptItem, quantity: receiptItem.quantity - 1 } : receiptItem)));
        } else {
            alert("이 항목은 더 이상 선택할 수 없습니다.");
        }
    };

    const totalAmount = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);

    // 내가 선택한 항목을 제거하는 함수
    const handleRemoveItem = (indexToRemove) => {
        const itemToRemove = selectedItems[indexToRemove];

        if (itemToRemove.quantity > 1) {
            setSelectedItems((prevItems) => prevItems.map((item, index) => (index === indexToRemove ? { ...item, quantity: item.quantity - 1 } : item)));
        } else {
            setSelectedItems((prevItems) => prevItems.filter((_, index) => index !== indexToRemove));
        }

        setReceiptItems((prevItems) => prevItems.map((receiptItem) => (receiptItem.name === itemToRemove.name ? { ...receiptItem, quantity: receiptItem.quantity + 1 } : receiptItem)));
    };

    // 영수증 선택 시 상태 업데이트
    const handleImageClick = (index) => {
        setCurrentReceiptIndex(index);
        setReceiptItems(receiptData[index].items); // 영수증 항목 업데이트
        setCurrentImageIndex(index); // 선택된 영수증 이미지 업데이트
    };

    const handleImageDoubleClick = () => {
        setIsModalImgActive(true);
    };

    const closeImageModal = () => {
        setIsModalImgActive(false);
    };

    const openEditModal = (item, index) => {
        setEditItem({ ...item, index });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditItem(null);
    };

    const handleSave = () => {
        const updatedItems = receiptItems.map((item, index) => (index === editItem.index ? { ...editItem } : item));
        setReceiptItems(updatedItems);
        closeEditModal();
    };

    const handleChange = (e, field) => {
        const value = field === "price" || field === "quantity" ? Number(e.target.value) : e.target.value;
        setEditItem((prevItem) => ({
            ...prevItem,
            [field]: value,
        }));
    };

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

    // 상태 변경 로직: 진행중 -> 완료 -> 진행중
    const toggleStatus = (index) => {
        setMembers((prevMembers) =>
            prevMembers.map((member, i) =>
                i === index
                    ? {
                          ...member,
                          status: member.status === "완료" ? "진행중" : "완료",
                      }
                    : member
            )
        );
    };

    // "나머지 금액은 1/N으로" 혹은 "정산 완료" 버튼 클릭 시, 모든 "진행중" 상태를 "완료"로 변경
    const completeSettlement = () => {
        setMembers((prevMembers) => prevMembers.map((member) => (member.status === "진행중" ? { ...member, status: "완료" } : member)));
    };
    return (
        <div className="settlement-page">
            <div className="header-section">
                <div className="title">PayDay</div>
                <div className="total-amount">총 금액: {totalReceiptAmount}원</div>
                <div className="image-preview-list">
                    {receiptData.map((image, index) => (
                        <img
                            key={index}
                            src={image.image}
                            alt={`영수증 예시 ${index + 1}`}
                            onClick={() => handleImageClick(index)}
                            onDoubleClick={handleImageDoubleClick}
                            className={`preview-image ${currentImageIndex === index ? "selected" : ""}`}
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
                {isModalImgActive && <ImageModal src={receiptData[currentImageIndex].image} onClose={closeImageModal} />}
            </div>

            <div className="main-content">
                <div className="receipt-block">
                    <div className="receipt-header">
                        <h2>{currentReceipt.storeName}</h2>
                        <p>{currentReceipt.date}</p>
                        <p>{currentReceipt.address}</p>
                    </div>
                    <div className="receipt-content">
                        <table>
                            <thead>
                                <tr>
                                    <th>상품명</th>
                                    <th>단가</th>
                                    <th>수량</th>
                                    <th>금액</th>
                                    <th>수정</th>
                                </tr>
                            </thead>
                            <tbody>
                                {receiptItems.map((item, index) => (
                                    <tr key={index} onClick={() => handleSelectItem(item)}>
                                        <td>{item.name}</td>
                                        <td>{item.price.toLocaleString()}</td>
                                        <td>{item.quantity}</td>
                                        <td>{(item.price * item.quantity).toLocaleString()}</td>
                                        <td>
                                            <button
                                                className="edit-button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openEditModal(item, index);
                                                }}
                                            >
                                                edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {isEditModalOpen && <EditModal editItem={editItem} handleSave={handleSave} handleChange={handleChange} closeEditModal={closeEditModal} />}
                <div className="sidebar">
                    <div className="member-status">
                        <ul className="member-list">
                            {members.map((member, index) => (
                                <p key={index} className="circle" style={getStatusStyle(member.status)}>
                                    {member.name.charAt(0)}
                                    <span className="tooltip">{member.name}</span>
                                </p>
                            ))}
                        </ul>
                    </div>
                    <div className="selected-items">
                        <h4>내가 선택한 항목</h4>
                        {selectedItems.length === 0 && <h5>영수증 항목을 클릭하여 선택</h5>}
                        <ul>
                            {selectedItems.map((item, index) => (
                                <li key={index} onClick={() => handleRemoveItem(index)}>
                                    {item.name} - {item.price.toLocaleString()}원 x {item.quantity}개
                                </li>
                            ))}
                        </ul>
                        {selectedItems.length > 0 && <h4>총 금액: {totalAmount.toLocaleString()}원</h4>}
                    </div>
                    <div className="button-group">
                        <button>타임라인 보기</button>
                        <button onClick={completeSettlement}>나머지 금액은 1/N으로</button>
                        <button onClick={completeSettlement}>정산 완료</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettlementPage;
