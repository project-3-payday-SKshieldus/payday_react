import { useState } from "react";
import Receipt from "../components/MainReceipt";
import SelectedItems from "../components/SelectedItems";
import Members from "../components/Members";
import ImageModal from "../components/ImageModal";
import receiptData from "../data/receiptData.jsx"; // Assuming the receipt data is imported from another file

import "./SettlementPage.css";

const SettlementPage = () => {
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

    const handleSelectItem = (item) => {
        const existingItem = selectedItems.find((selected) => selected.name === item.name);

        if (existingItem) {
            setSelectedItems((prevItems) => prevItems.map((selected) => (selected.name === item.name ? { ...selected, quantity: selected.quantity + 1 } : selected)));
        } else {
            // Only pass the required fields (name, price, quantity), remove index
            const validItem = {
                name: item.name,
                price: item.price,
                quantity: 1, // Start with a quantity of 1 when adding a new item
            };

            setSelectedItems((prevItems) => [...prevItems, validItem]);
        }

        // Update receiptItems and decrease the selected item's quantity
        setReceiptItems((prevItems) =>
            prevItems.map((receiptItem) =>
                receiptItem.name === item.name
                    ? { ...receiptItem, quantity: receiptItem.quantity - 1 } // Decrease the quantity
                    : receiptItem
            )
        );
    };
    const handleSaveItem = (updatedItem) => {
        setReceiptItems((prevItems) => prevItems.map((item) => (item.name === updatedItem.name ? { ...updatedItem } : item)));
    };

    const handleRemoveItem = (indexToRemove) => {
        const itemToRemove = selectedItems[indexToRemove];

        // Remove the item from selectedItems or decrease the quantity
        if (itemToRemove.quantity > 1) {
            setSelectedItems((prevItems) => prevItems.map((item, index) => (index === indexToRemove ? { ...item, quantity: item.quantity - 1 } : item)));
        } else {
            setSelectedItems((prevItems) => prevItems.filter((_, index) => index !== indexToRemove));
        }

        // Restore the quantity of the item in receiptItems
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

    const totalAmountAllReceipts = receiptData.reduce((total, receipt) => {
        return total + receipt.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }, 0);

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
                            className={`preview-image ${currentReceiptIndex === index ? "selected" : ""}`}
                        />
                    ))}
                </div>
            </div>

            <div className="main-content">
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

            {isModalImgActive && <ImageModal src={receiptData[currentReceiptIndex].image} onClose={() => setIsModalImgActive(false)} />}
        </div>
    );
};

export default SettlementPage;
