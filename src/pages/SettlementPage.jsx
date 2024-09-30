import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReceiptContext } from "../context/ReceiptContext";
import MainReceipt from "../components/MainReceipt";
import SelectedItems from "../components/SelectedItems";
import Members from "../components/Members";
import ImageModal from "../components/ImageModal";
import "./SettlementPage.css";

const SettlementPage = () => {
    const { getResponseDataForRoom, getRoomById } = useContext(ReceiptContext);
    const { roomId } = useParams();
    const navigate = useNavigate();

    // 불러온 데이터들을 저장하는 상태들
    const [receiptData, setReceiptData] = useState([]);
    const [receiptItems, setReceiptItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [currentReceiptIndex, setCurrentReceiptIndex] = useState(0);
    const [members, setMembers] = useState([]);
    const [isModalImgActive, setIsModalImgActive] = useState(false);
    const [modalImage, setModalImage] = useState(null);
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    // 방 정보를 가져옴
    useEffect(() => {
        const roomData = getRoomById(roomId);
        if (roomData) {
            setMembers(roomData.members.map(member => ({ name: member, status: "진행중" })));
        }
    }, [roomId, getRoomById]);

    // 영수증 데이터를 가져옴
    useEffect(() => {
        const responseData = getResponseDataForRoom();
        if (responseData.length > 0) {
            setReceiptData(responseData);
            setReceiptItems(responseData[0]?.answer_text.items || []);
        }
    }, [getResponseDataForRoom]);

    const handleSelectItem = (item) => {
        const existingItem = selectedItems.find((selected) => selected.name === item.name);

        if (existingItem) {
            setSelectedItems((prevItems) =>
                prevItems.map((selected) =>
                    selected.name === item.name ? { ...selected, quantity: selected.quantity + 1, order: currentReceiptIndex + 1 } : selected
                )
            );
        } else {
            setSelectedItems((prevItems) => [...prevItems, { ...item, quantity: 1, order: currentReceiptIndex + 1 }]);
        }

        setReceiptItems((prevItems) =>
            prevItems.map((receiptItem) =>
                receiptItem.name === item.name ? { ...receiptItem, quantity: receiptItem.quantity - 1 } : receiptItem
            )
        );
    };

    const handleItemSave = (updatedItem) => {
        setReceiptItems((prevItems) =>
            prevItems.map((item) => (item.name === updatedItem.name ? { ...updatedItem } : item))
        );
    };

    const handleRemoveItem = (indexToRemove) => {
        const itemToRemove = selectedItems[indexToRemove];

        if (itemToRemove.quantity > 1) {
            setSelectedItems((prevItems) =>
                prevItems.map((item, index) =>
                    index === indexToRemove ? { ...item, quantity: item.quantity - 1 } : item
                )
            );
        } else {
            setSelectedItems((prevItems) => prevItems.filter((_, index) => index !== indexToRemove));
        }

        setReceiptItems((prevItems) =>
            prevItems.map((receiptItem) =>
                receiptItem.name === itemToRemove.name ? { ...receiptItem, quantity: receiptItem.quantity + 1 } : receiptItem
            )
        );
    };

    const totalAmount = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const totalAmountGrand = receiptData.reduce((total, receipt) => {
        const receiptTotal = receipt.answer_text.items.reduce((subTotal, item) => subTotal + item.price * item.quantity, 0);
        return total + receiptTotal;
    }, 0);

    const handleImageClick = (index) => {
        setCurrentReceiptIndex(index);
        setReceiptItems(receiptData[index]?.answer_text.items || []);
    };

    const handleImageDoubleClick = (index) => {
        const resultImgURL = receiptData[index].ResultimgURL;
        setModalImage(resultImgURL);
        setIsModalImgActive(true);
    };

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

    const completeSettlement = async () => {
        const username = localStorage.getItem("userName");

        const settlementData = {
            username: username,
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

            console.log("정산 데이터가 성공적으로 전송되었습니다.");
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
                    <Members members={members} />
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
