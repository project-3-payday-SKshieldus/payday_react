import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReceipts } from "../context/ReceiptContext";
import MainReceipt from "../components/MainReceipt";
import SelectedItems from "../components/SelectedItems";
import Members from "../components/Members";
import ImageModal from "../components/ImageModal";
import "./SettlementPage.css";

const SettlementPage = () => {
    const { currentRoom, fetchRoomDataFromServer } = useReceipts();
    const { roomId } = useParams();
    const navigate = useNavigate();

    const [selectedItems, setSelectedItems] = useState([]);
    const [currentReceiptIndex, setCurrentReceiptIndex] = useState(0);
    const [isModalImgActive, setIsModalImgActive] = useState(false);
    const [modalImage, setModalImage] = useState(null);

    // Fetch room data when the roomId changes
    useEffect(() => {
        if (roomId) {
            fetchRoomDataFromServer(roomId);
        }
    }, [roomId, fetchRoomDataFromServer]);

    const handleSelectItem = (item) => {
        const existingItem = selectedItems.find((selected) => selected.name === item.name);

        if (existingItem) {
            setSelectedItems((prevItems) => prevItems.map((selected) =>
            (selected.name === item.name ?
                { ...selected, quantity: selected.quantity + 1, order: currentReceiptIndex + 1 } : selected)));
        } else {
            setSelectedItems((prevItems) =>
                [...prevItems, { ...item, quantity: 1, order: currentReceiptIndex + 1 }]);
        }
    };

    const handleRemoveItem = (indexToRemove) => {
        const itemToRemove = selectedItems[indexToRemove];

        if (itemToRemove.quantity > 1) {
            setSelectedItems((prevItems) =>
                prevItems.map((item, index) =>
                    index === indexToRemove ? { ...item, quantity: item.quantity - 1 } : item)));
        } else {
            setSelectedItems((prevItems) =>
                prevItems.filter((_, index) =>
                    index !== indexToRemove));
        }
    };

    const totalAmount = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const totalAmountGrand =
        currentRoom?.receipts?.reduce((total, receipt) => {
            return total + receipt.items.reduce((subTotal, item) => subTotal + item.price * item.quantity, 0);
        }, 0) || 0;

    const handleImageClick = (index) => {
        setCurrentReceiptIndex(index);
    };

    const handleImageDoubleClick = (index) => {
        const resultImgURL = currentRoom?.receipts[index].ResultimgURL;
        setModalImage(resultImgURL);
        setIsModalImgActive(true);
    };

    const completeSettlement = async () => {
        const username = localStorage.getItem("userName");

        const settlementData = {
            username,
            items: selectedItems,
        };

        try {
            const response = await fetch("/api/settlement", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(settlementData),
            });

            if (!response.ok) {
                throw new Error("정산 데이터를 전송하는 중 오류가 발생했습니다.");
            }

            navigate(`/room/${roomId}/settle`);
        } catch (error) {
            console.error("정산 데이터 전송 실패:", error);
        }
    };

    const viewTimeline = () => {
        navigate(`/room/${roomId}/timeline`);
    };

    return (
        <div className="settlement-page">
            <div className="header-section">
                <div className="title">PayDay</div>
                <div className="total-amount">총 금액: {totalAmountGrand.toLocaleString()}원</div>
                <div className="image-preview-list">
                    {currentRoom?.receipts?.map((receipt, index) => (
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
            </div>

            <div className="main-content">
                {currentRoom?.receipts[currentReceiptIndex] && (
                    <MainReceipt
                        receiptItems={currentRoom.receipts[currentReceiptIndex].items}
                        receiptData={{
                            storeName: currentRoom.receipts[currentReceiptIndex]?.title || "Unknown Store",
                            date: currentRoom.receipts[currentReceiptIndex]?.date || "N/A",
                            address: currentRoom.receipts[currentReceiptIndex]?.address || "N/A",
                        }}
                        onItemSelect={handleSelectItem}
                    />
                )}

                <div className="content-container">
                    <Members members={currentRoom?.members || []} />
                    <SelectedItems selectedItems={selectedItems} totalAmount={totalAmount} onRemoveItem={handleRemoveItem} />
                    <div className="button-group">
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
