import { useState } from "react";
import Receipt from "../component/Receipt";
import WinnerPopup from "../component/WinnerPopup";
import ReceiptPopup from "../component/ReceiptPopup";
import './SettleFinishPage.css';

const SettleFinishPage = () => {
    const [winner, setWinner] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [showReceiptPopup, setShowReceiptPopup] = useState(false);

    const people = [
        { name: "지인", amount: 12100 },
        { name: "경재", amount: 17900 },
        { name: "민혁", amount: 28600 }
    ];

    const receiptData = [
        {
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

    const totalAmount = 88300;

    const personReceiptMap = {
        "지인": [receiptData[0], receiptData[1]],
        "경재": [receiptData[2]],
        "민혁": [receiptData[1], receiptData[2]],
    };

    const remainingAmount = totalAmount - people.reduce((sum, person) => sum + person.amount, 0);

    const handlePersonClick = (person) => {
        const receipts = personReceiptMap[person.name];
        setSelectedPerson({ ...person, receipts });
        setShowReceiptPopup(true); 
    };

    const handleRandomDraw = () => {
        const randomIndex = Math.floor(Math.random() * people.length);
        const selectedPerson = people[randomIndex];

        setWinner({
            ...selectedPerson,
            remainingAmount: remainingAmount 
        });
        setShowPopup(true);  
    };

    const handleClosePopup = () => {
        setShowPopup(false);  
        setShowReceiptPopup(false);  
    };

    return (
        <Receipt>
            {/* 총액 부분에 클래스 추가 */}
            <h2 className="total-amount">전체 총액: {totalAmount.toLocaleString()}원</h2>
            
            {people.map((person, index) => (
                <p key={index} onClick={() => handlePersonClick(person)} className="clickable person-amount">
                    {person.name}님의 정산 금액은<br></br> 총 <span className="amount">{person.amount.toLocaleString()}원</span> 입니다.
                </p>
            ))}

            <p className="remaining-amount">
                남은 금액의 1/{people.length} 금액은<br></br> <span className="amount">{(remainingAmount / people.length).toLocaleString()}원</span> 입니다.
            </p>
            
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
