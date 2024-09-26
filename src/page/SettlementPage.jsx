import { useState } from "react";
import Receipt from "../components/MainReceipt";
import SelectedItems from "../components/SelectedItems";
import Members from "../components/Members";
import ImageModal from "../components/ImageModal";
import receiptData from "../data/receiptData.jsx"; // Assuming the receipt data is imported from another file

import "./SettlementPage.css";

const SettlementPage = () => {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [currentReceiptIndex, setCurrentReceiptIndex] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const [receiptItems, setReceiptItems] = useState(receiptData[0]?.items || []); // Ensure receiptItems is initialized properly
    const [members, setMembers] = useState([
        { name: "김승연", status: "완료" },
        { name: "임지인", status: "진행중" },
        { name: "조경재", status: "진행중" },
        { name: "정우석", status: "완료" },
        { name: "홍민혁", status: "진행중" },
    ]);
    const [isModalImgActive, setIsModalImgActive] = useState(false);
    const [modalImage, setModalImage] = useState(null); // To store the image for the modal

    const handleSelectItem = (item) => {
        const existingItem = selectedItems.find((selected) => selected.name === item.name);

        if (existingItem) {
            setSelectedItems((prevItems) => prevItems.map((selected) => (selected.name === item.name ? { ...selected, quantity: selected.quantity + 1 } : selected)));
        } else {
            const validItem = {
                name: item.name,
                price: item.price,
                quantity: 1,
            };
            setSelectedItems((prevItems) => [...prevItems, validItem]);
        }

        setReceiptItems((prevItems) => prevItems.map((receiptItem) => (receiptItem.name === item.name ? { ...receiptItem, quantity: receiptItem.quantity - 1 } : receiptItem)));
    };

    const handleSaveItem = (updatedItem) => {
        setReceiptItems((prevItems) => prevItems.map((item) => (item.name === updatedItem.name ? { ...updatedItem } : item)));
    };

    const handleRemoveItem = (indexToRemove) => {
        const itemToRemove = selectedItems[indexToRemove];

        if (itemToRemove.quantity > 1) {
            setSelectedItems((prevItems) => prevItems.map((item, index) => (index === indexToRemove ? { ...item, quantity: item.quantity - 1 } : item)));
        } else {
            setSelectedItems((prevItems) => prevItems.filter((_, index) => index !== indexToRemove));
        }

        setReceiptItems((prevItems) => prevItems.map((receiptItem) => (receiptItem.name === itemToRemove.name ? { ...receiptItem, quantity: receiptItem.quantity + 1 } : receiptItem)));
    };

    const totalAmount = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);

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

    const completeSettlement = () => {
        setMembers((prevMembers) => prevMembers.map((member) => (member.status === "진행중" ? { ...member, status: "완료" } : member)));
    };

    const handleImageClick = (index) => {
        setCurrentReceiptIndex(index);
        setReceiptItems(receiptData[index]?.items || []); // Ensure receiptItems is updated and initialized
    };

    // Calculate total amount for all receipts
    const totalAmountAllReceipts = receiptData.reduce((total, receipt) => {
        return total + receipt.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }, 0);

    // Handle double click on image to show modal
    const handleImageDoubleClick = (index) => {
        setModalImage(receiptData[index].image); // Set the image for the modal
        setIsModalImgActive(true); // Show modal
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

    return (
        <div className="settlement-page">
            <div className="header-section">
                <div className="title">PayDay</div>
                <div className="total-amount">총 금액: {totalAmountAllReceipts.toLocaleString()}원</div>
                <div className="image-preview-list">
                    {receiptData.map((image, index) => (
                        <img
                            key={index}
                            src={image.image}
                            alt={`영수증 예시 ${index + 1}`}
                            onClick={() => handleImageClick(index)}
                            onDoubleClick={() => handleImageDoubleClick(index)} // Handle double-click event
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
                <span className="content-index">{currentReceiptIndex + 1}</span> {/* Receipt index */}
                <Receipt receiptItems={receiptItems} receiptData={receiptData[currentReceiptIndex]} onItemSelect={handleSelectItem} onItemSave={handleSaveItem} />
                <div className="content-container">
                    <Members members={members} toggleStatus={toggleStatus} />
                    <SelectedItems selectedItems={selectedItems} totalAmount={totalAmount} onRemoveItem={handleRemoveItem} />
                    <div className="button-group">
                        <button onClick={completeSettlement}>나머지 금액은 1/N으로</button>
                        <button onClick={completeSettlement}>정산 완료</button>
                    </div>
                </div>
            </div>

            {/* Show modal if isModalImgActive is true */}
            {isModalImgActive && <ImageModal src={modalImage} onClose={() => setIsModalImgActive(false)} />}
        </div>
    );
};

export default SettlementPage;
