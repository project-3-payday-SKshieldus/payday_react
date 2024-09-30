import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReceiptContext } from "../context/ReceiptContext";
import MainReceipt from "../components/MainReceipt";
import SelectedItems from "../components/SelectedItems";
import Members from "../components/Members";
import ImageModal from "../components/ImageModal";
import "./SettlementPage.css";

const SettlementPage = () => {
    const { getResponseDataForRoom } = useContext(ReceiptContext);
    const { roomId } = useParams();
    const navigate = useNavigate();

    // 불러온 데이터들을 저장하는 상태들
    const [receiptData, setReceiptData] = useState([]);
    const [receiptItems, setReceiptItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [currentReceiptIndex, setCurrentReceiptIndex] = useState(0);
    const [members, setMembers] = useState([
        { name: "김승연", status: "완료" },
        { name: "임지인", status: "진행중" },
        { name: "조경재", status: "진행중" },
        { name: "정우석", status: "완료" },
        { name: "홍민혁", status: "진행중" },
    ]);

    // 모달 이미지 관리
    const [isModalImgActive, setIsModalImgActive] = useState(false);
    const [modalImage, setModalImage] = useState(null);

    // 툴팁 위치 및 표시 여부 관리
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    // 방에 대한 데이터 로드
    const responseData = getResponseDataForRoom();

    // 현재 선택된 영수증 데이터 기본 값 설정
    const currentReceipt = receiptData[currentReceiptIndex] || {
        storeName: "Unknown Store",
        date: "N/A",
        address: "N/A",
        items: [],
    };

    // 데이터가 변경되면 receiptData 상태 업데이트
    useEffect(() => {
        if (responseData.length > 0) {
            setReceiptData(responseData);
            setReceiptItems(responseData[0]?.answer_text.items || []);
        }
    }, [responseData]);

    // 영수증 항목을 선택하면 selectedItems에 추가하는 함수
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
    const handleItemSave = (updatedItem) => {
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
        const receiptTotal = receipt.answer_text.items.reduce((subTotal, item) => subTotal + item.price * item.quantity, 0);
        return total + receiptTotal;
    }, 0);

    // 멤버 상태 변경
    const toggleStatus = (index) => {
        setMembers((prevMembers) => prevMembers.map((member, i) => (i === index ? { ...member, status: member.status === "완료" ? "진행중" : "완료" } : member)));
    };

    // 영수증 이미지 클릭 시 해당 영수증으로 이동
    const handleImageClick = (index) => {
        setCurrentReceiptIndex(index);
        setReceiptItems(receiptData[index]?.answer_text.items || []);
    };

    // 이미지 더블 클릭 시 모달 열기
    const handleImageDoubleClick = (index) => {
        const resultImgURL = receiptData[index].ResultimgURL;
        setModalImage(resultImgURL);
        setIsModalImgActive(true);
    };

    // 링크 복사 기능
    const handleCopyLink = (e) => {
        const currentUrl = `${window.location.origin}/room/${roomId}/guest`;
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

    // "정산 완료" 버튼 클릭 시 호출
    const completeSettlement = () => {
        setIsSettled(true);
    };

    // "나머지 금액 1/N" 버튼 클릭 시 호출
    const handleOneNSettlement = () => {
        navigate(`/room/${roomId}/settle`);
    };

    // 타임라인 보기 버튼 클릭 시 호출될 함수
    const viewTimeline = () => {
        navigate(`/room/${roomId}/timeline`);
    };

    return (
        <div className="settlement-page">
            <div className="header-section">
                <div className="title">PayDay</div>
                <div className="total-amount">총 금액: {totalAmountGrand.toLocaleString()}원</div>
                <div className="image-preview-list">
                    {receiptData.map((receipt, index) => (
                        <img
                            key={index}
                            src={receipt.imgURL}
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
                <MainReceipt
                    receiptItems={receiptItems}
                    receiptData={{
                        storeName: receiptData[currentReceiptIndex]?.answer_text?.title || "Unknown Store",
                        date: receiptData[currentReceiptIndex]?.answer_text?.date || "N/A",
                        address: receiptData[currentReceiptIndex]?.answer_text?.address || "N/A",
                    }}
                    onItemSave={handleItemSave}
                    onItemSelect={handleSelectItem}
                />
                <div className="content-container">
                    <Members members={members} toggleStatus={toggleStatus} />
                    <SelectedItems selectedItems={selectedItems} totalAmount={totalAmount} onRemoveItem={handleRemoveItem} />
                    <div className="button-group">
                        <button onClick={handleOneNSettlement}>나머지 금액은 1/N으로</button>
                        <button onClick={completeSettlement}>정산 완료</button>
                        <button onClick={viewTimeline}>타임라인 보기</button>
                    </div>
                </div>
            </div>

            {isModalImgActive && <ImageModal src={modalImage} onClose={() => setIsModalImgActive(false)} />}
        </div>
    );
};

export default SettlementPage;
