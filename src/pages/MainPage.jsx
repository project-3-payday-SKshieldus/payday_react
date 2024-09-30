import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReceipts } from '../context/ReceiptContext';  // ReceiptContext에서 useReceipts 가져오기
import Receipt from "../components/Receipt";
import Footer from "../components/Footer";
import './MainPage.css';

const MainPage = () => {
    const [count, setCount] = useState(0);
    const [roomName, setRoomName] = useState(''); 
    const [userName, setUserName] = useState(''); 
    const [errorMessage, setErrorMessage] = useState('');
    const { createRoom } = useReceipts();  // ReceiptContext에서 createRoom 함수를 가져옴
    const navigate = useNavigate();

    const handleIncrement = () => {
        setCount(count + 1);
    };

    const handleDecrement = () => {
        if (count > 0) {
            setCount(count - 1);
        }
    };

    const handleStartCalculation = () => {
        if (roomName.trim() === '' || userName.trim() === '') {
            setErrorMessage('정산방 이름과 이름을 입력해주세요.');
        } else {
            setErrorMessage(''); 
            const roomId = createRoom(roomName, userName);  // 방 생성 후 roomId 반환
            localStorage.setItem('userName', userName);  // 로컬 스토리지에 이름 저장
            navigate(`/upload/${roomId}`);  // 방 생성 후 roomId를 포함한 경로로 이동
        }
    };

    return (
        <Receipt explanation="더 쉽게 정산하세요! 영수증만 올리면 자동으로 계산해 드립니다.">
            <div className="counter-container">
                <div className="counter-box">
                    <p>{count}</p>
                </div>
                <div className="button-container">
                    <button className="count-button" onClick={handleIncrement}>+</button>
                    <button className="count-button" onClick={handleDecrement}>-</button>
                </div>
            </div>
            <div className='start-container'>
                <input
                    className='input-box'
                    placeholder="정산방 이름을 작성해주세요"
                    value={roomName} 
                    onChange={(e) => setRoomName(e.target.value)} 
                />
                <input
                    className='input-box'
                    placeholder="이름을 입력하세요"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
                {errorMessage && <p className="error-message">{errorMessage}</p>} 
                <button className='button-start' onClick={handleStartCalculation}>정산시작하기</button>
            </div>
            <Footer />
        </Receipt>
    );
};

export default MainPage;
