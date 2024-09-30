import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Receipt from "../components/Receipt";
import WinnerPopup from "../components/WinnerPopup";
import ReceiptPopup from "../components/ReceiptPopup";
import './SettleFinishPage.css';

const SettleFinishPage = () => {
    const { roomId } = useParams(); // roomId를 URL에서 가져옴
    const [winner, setWinner] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [showReceiptPopup, setShowReceiptPopup] = useState(false);
    const [people, setPeople] = useState([]); // 사용자 정산 정보
    const [receiptData, setReceiptData] = useState([]); // 영수증 데이터
    const [totalAmount, setTotalAmount] = useState(0); // 전체 금액
    const [remainingAmount, setRemainingAmount] = useState(0); // 남은 금액

    // API로부터 데이터를 불러옴
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 전체 영수증 데이터 API 호출
                const receiptResponse = await fetch(`/api/room/${roomId}/receipts`);
                const receipts = await receiptResponse.json();
                setReceiptData(receipts);

                // 전체 금액 계산
                const total = receipts.reduce((sum, receipt) => {
                    return sum + receipt.items.reduce((subtotal, item) => subtotal + item.price * item.quantity, 0);
                }, 0);
                setTotalAmount(total);

                // 각 사용자의 정산 금액 계산
                const peopleResponse = await fetch(`/api/room/${roomId}/members`);
                const members = await peopleResponse.json();

                const updatedPeople = members.map((member) => {
                    const memberReceipts = receipts.filter(receipt => member.receipts.includes(receipt.id));
                    const memberAmount = memberReceipts.reduce((sum, receipt) => {
                        return sum + receipt.items.reduce((subtotal, item) => subtotal + item.price * item.quantity, 0);
                    }, 0);

                    return { ...member, amount: memberAmount };
                });

                setPeople(updatedPeople);

                // 남은 금액 계산
                const settledAmount = updatedPeople.reduce((sum, person) => sum + person.amount, 0);
                setRemainingAmount(total - settledAmount);
            } catch (error) {
                console.error("데이터를 불러오는 중 오류가 발생했습니다.", error);
            }
        };

        fetchData();
    }, [roomId]);

    // 사람을 클릭하면 해당 사람의 영수증 데이터를 불러옴
    const handlePersonClick = (person) => {
        const personReceipts = receiptData.filter((receipt) =>
            person.receipts.includes(receipt.id) // 각 사람이 관련된 영수증을 필터링
        );
        setSelectedPerson({ ...person, receipts: personReceipts });
        setShowReceiptPopup(true);
    };

    // 남은 금액을 한 사람에게 몰아주기
    const handleRandomDraw = () => {
        const randomIndex = Math.floor(Math.random() * people.length);
        const selectedPerson = people[randomIndex];

        setWinner({
            ...selectedPerson,
            remainingAmount: remainingAmount, // 남은 금액을 전달
        });
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);  
        setShowReceiptPopup(false);  
    };

    return (
        <Receipt>
            <h2 className="total-amount">전체 총액: {totalAmount.toLocaleString()}원</h2>

            {people.map((person, index) => (
                <p key={index} onClick={() => handlePersonClick(person)} className="clickable person-amount">
                    {person.name}님의 정산 금액은<br /> 총 <span className="amount">{person.amount.toLocaleString()}원</span> 입니다.
                </p>
            ))}

            <p className="remaining-amount">
                남은 금액의 1/{people.length} 금액은<br /> <span className="amount">{(remainingAmount / people.length).toLocaleString()}원</span> 입니다.
            </p>
            <h5>금액을 클릭하여 정산 목록 확인</h5>
            <button className='button-mini random-draw-button' onClick={handleRandomDraw}>한 사람 몰아주기</button>

            {showReceiptPopup && selectedPerson && (
                <ReceiptPopup 
                    person={selectedPerson} 
                    onClose={handleClosePopup}
                    receipts={selectedPerson.receipts} 
                />
            )}
            {showPopup && winner && (
                <WinnerPopup 
                    winner={winner} 
                    onClose={handleClosePopup} 
                    remainingAmount={remainingAmount} 
                />
            )}
        </Receipt>
    );
};

export default SettleFinishPage;
