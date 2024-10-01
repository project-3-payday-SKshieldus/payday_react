import { useState, useEffect, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import Receipt from "../components/Receipt";
import WinnerPopup from "../components/WinnerPopup";
import ReceiptPopup from "../components/ReceiptPopup";
import { ReceiptContext } from "../context/ReceiptContext";
import "./SettleFinishPage.css";

const SettleFinishPage = () => {
    const { roomId } = useParams();
    const { currentRoom, fetchRoomDataFromServer } = useContext(ReceiptContext);
    const [winner, setWinner] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [showReceiptPopup, setShowReceiptPopup] = useState(false); // 이 줄이 빠져 있었음
    const [remainingAmount, setRemainingAmount] = useState(0);

    // useCallback으로 fetchRoomDataFromServer 메모이제이션
    const fetchRoomData = useCallback(() => {
        fetchRoomDataFromServer(roomId);
    }, [fetchRoomDataFromServer, roomId]);

    useEffect(() => {
        if (roomId) {
            fetchRoomData();
        }
    }, [roomId, fetchRoomData]);

    const handlePersonClick = (person) => {
        setSelectedPerson(person);
        setShowReceiptPopup(true);
    };

    const handleRandomDraw = () => {
        const randomIndex = Math.floor(Math.random() * currentRoom.members.length);
        const selectedPerson = currentRoom.members[randomIndex];

        setWinner({
            ...selectedPerson,
            remainingAmount: remainingAmount,
        });
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setShowReceiptPopup(false);
    };

    return (
        <Receipt>
            <h2 className="total-amount">전체 총액: {currentRoom ? currentRoom.totalAmount.toLocaleString() : "0"}원</h2>

            {currentRoom?.members.map((person, index) => (
                <p key={index} onClick={() => handlePersonClick(person)} className="clickable person-amount">
                    {person.memberName}님의 정산 금액은
                    <br /> 총 <span className="amount">{person.amount?.toLocaleString() || 0}원</span> 입니다.
                </p>
            ))}

            <p className="remaining-amount">
                남은 금액의 1/{currentRoom?.members.length || 1} 금액은
                <br />
                <span className="amount">{(remainingAmount / (currentRoom?.members.length || 1)).toLocaleString()}원</span> 입니다.
            </p>
            <h5>금액을 클릭하여 정산 목록 확인</h5>
            <button className="button-mini random-draw-button" onClick={handleRandomDraw}>
                한 사람 몰아주기
            </button>

            {showReceiptPopup && selectedPerson && <ReceiptPopup person={selectedPerson} onClose={handleClosePopup} receipts={selectedPerson.receiptContentsPerMember} />}
            {showPopup && winner && <WinnerPopup winner={winner} onClose={handleClosePopup} remainingAmount={remainingAmount} />}
        </Receipt>
    );
};

export default SettleFinishPage;
