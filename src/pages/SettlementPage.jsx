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

    const responseData = getResponseDataForRoom();
 
    useEffect(() => {
        if (responseData.length > 0) {
            setReceiptData(responseData);
            setReceiptItems(responseData[0]?.answer_text.items || []);
        }
    }, [responseData]);

    useEffect(() => {
        // 멤버 정보를 가져오는 함수 (API 호출)
        const fetchMembers = async () => {
            try {
                const response = await fetch(`/api/members/${roomId}`);
                if (!response.ok) {
                    throw new Error("멤버 데이터를 가져오는데 실패했습니다.");
                }
                const membersData = await response.json();

                // 상태 업데이트 로직: 각 멤버의 상태를 "진행중" 또는 "완료"로 변경
                const updatedMembers = membersData.map((member) => {
                    const isMemberDone = selectedItems.some((item) => item.memberName === member.name);
                    return { ...member, status: isMemberDone ? "완료" : "진행중" };
                });

                setMembers(updatedMembers);
            } catch (error) {
                console.error("멤버 정보 로드 실패:", error);
            }
        };

        fetchMembers();
    }, [roomId, selectedItems]);

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

    const toggleStatus = (index) => {
        setMembers((prevMembers) =>
            prevMembers.map((member, i) =>
                i === index ? { ...member, status: member.status === "완료" ? "진행중" : "완료" } : member
            )
        );
    };

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
                    <Members members={members} toggleStatus={toggleStatus} />
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
