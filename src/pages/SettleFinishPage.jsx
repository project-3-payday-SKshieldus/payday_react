import { useEffect, useState } from "react";
import Receipt from "../components/Receipt";
import WinnerPopup from "../components/WinnerPopup";
import ReceiptPopup from "../components/ReceiptPopup";
import './SettleFinishPage.css';
import axios from 'axios';

const SettleFinishPage = () => {
    const [winner, setWinner] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [showReceiptPopup, setShowReceiptPopup] = useState(false);
    const [people, setPeople] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [personReceiptMap, setPersonReceiptMap] = useState({});

    useEffect(() => {
        // Fetching the receipt data from the backend
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/receipts'); // Adjust the endpoint as necessary
                const fetchedPeople = response.data; // Assuming the response contains an array of people with amounts
                setPeople(fetchedPeople);

                const fetchedTotalAmount = fetchedPeople.reduce((sum, person) => sum + person.amount, 0);
                setTotalAmount(fetchedTotalAmount);

                // Create a receipt map based on fetched data
                const fetchedReceipts = response.data.receipts; // Assuming receipts are part of the response
                const newPersonReceiptMap = {};
                fetchedPeople.forEach(person => {
                    newPersonReceiptMap[person.name] = fetchedReceipts.filter(receipt => receipt.memberName === person.name);
                });
                setPersonReceiptMap(newPersonReceiptMap);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, []);

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
