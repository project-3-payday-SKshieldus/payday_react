import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReceipts } from "../context/ReceiptContext";
import MainReceipt from "../components/MainReceipt";
import SelectedItems from "../components/SelectedItems";
import Members from "../components/Members";
import ImageModal from "../components/ImageModal";
import "./SettlementPage.css";

const SettlementPage = () => {
    const { currentRoom, fetchRoomDataFromServer, loading } = useReceipts();
    const { roomId } = useParams();
    const navigate = useNavigate();

    const [selectedItems, setSelectedItems] = useState([]);
    const [currentReceiptIndex, setCurrentReceiptIndex] = useState(0);
    const [isModalImgActive, setIsModalImgActive] = useState(false);
    const [modalImage, setModalImage] = useState(null);

    // 하드코딩된 영수증 데이터
    const hardcodedReceiptData = [
        {
            id: 1,
            ResultimgURL: "https://dummyimage.com/600x400/000/fff&text=Processed+Image+1",
            imgURL: "https://dummyimage.com/600x400/000/fff&text=Original+Image+1",
            answer_text: {
                title: "롯데리아 이대점",
                date: "2024/09/28 (토) 18:50",
                address: "서울특별시 서대문구 이화여대길 59 1층",
                items: [
                    { name: "우이락+실비김치", price: 3400, quantity: 1 },
                    { name: "내츄치즈스틱", price: 2600, quantity: 1 },
                    { name: "L포테이토", price: 2400, quantity: 6 },
                    { name: "어니언시즈닝", price: 200, quantity: 1 },
                    { name: "치즈시즈닝", price: 200, quantity: 1 },
                    { name: "칠리시즈닝", price: 200, quantity: 1 },
                    { name: "실비김치맛시즈닝", price: 200, quantity: 1 },
                    { name: "제로콜라 (L)", price: 2200, quantity: 1 },
                    { name: "[아이스]", price: 0, quantity: 2 }
                ]
            },
            order: 1
        }
    ];

    useEffect(() => {
        if (!currentRoom && !loading && roomId) {
            fetchRoomDataFromServer(roomId);
        }
    }, [currentRoom, loading, roomId, fetchRoomDataFromServer]);

    // 영수증 데이터가 없다면 하드코딩된 데이터로 대체
    useEffect(() => {
        if (currentRoom) {
            currentRoom.receipts = hardcodedReceiptData;  // 하드코딩된 영수증 데이터 설정
        }
    }, [currentRoom]);

    const handleSelectItem = (item) => {
        const existingItem = selectedItems.find((selected) => selected.name === item.name);

        if (existingItem) {
            setSelectedItems((prevItems) =>
                prevItems.map((selected) =>
                    selected.name === item.name ? { ...selected, quantity: selected.quantity + 1 } : selected
                )
            );
        } else {
            setSelectedItems((prevItems) => [...prevItems, { ...item, quantity: 1 }]);
        }
    };

    const handleRemoveItem = (indexToRemove) => {
        const itemToRemove = selectedItems[indexToRemove];

        if (itemToRemove.quantity > 1) {
            setSelectedItems((prevItems) =>
                prevItems.map((item, index) => (index === indexToRemove ? { ...item, quantity: item.quantity - 1 } : item))
            );
        } else {
            setSelectedItems((prevItems) => prevItems.filter((_, index) => index !== indexToRemove));
        }
    };

    const totalAmount = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalAmountGrand = currentRoom?.receipts?.reduce((total, receipt) => {
        return total + receipt.answer_text.items.reduce((subTotal, item) => subTotal + item.price * item.quantity, 0);
    }, 0) || 0;

    const handleImageClick = (index) => {
        setCurrentReceiptIndex(index);
    };

    const handleImageDoubleClick = (index) => {
        const resultImgURL = currentRoom?.receipts[index]?.ResultimgURL;
        setModalImage(resultImgURL);
        setIsModalImgActive(true);
    };

    const completeSettlement = async () => {
        const username = localStorage.getItem("userName");  // 로컬 스토리지에서 이름 가져오기

        // settlementData 구조를 JSON에 맞게 설정
        const settlementData = {
            username,  // 불러온 userName을 추가
            items: selectedItems.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                order: item.order, // order를 추가
            })),
        };

        try {
            const response = await fetch(`http://localhost:8080/api/room/${roomId}/${username}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(settlementData),  // JSON 형식으로 데이터 전송
            });

            if (!response.ok) {
                throw new Error("정산 데이터를 전송하는 중 오류가 발생했습니다.");
            }

            console.log("정산 데이터가 성공적으로 전송되었습니다.");
            navigate(`/room/${roomId}/settle`);  // 정산 완료 후 페이지 이동
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
                {currentRoom?.receipts?.[currentReceiptIndex] && (
                    <MainReceipt
                        receiptItems={currentRoom.receipts[currentReceiptIndex]?.answer_text.items || []}
                        receiptData={{
                            storeName: currentRoom.receipts[currentReceiptIndex]?.answer_text.title || "Unknown Store",
                            date: currentRoom.receipts[currentReceiptIndex]?.answer_text.date || "N/A",
                            address: currentRoom.receipts[currentReceiptIndex]?.answer_text.address || "N/A",
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
