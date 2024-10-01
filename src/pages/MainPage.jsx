import { useState } from 'react';
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

    const handleStartCalculation = async () => {
        if (roomName.trim() === '' || userName.trim() === '') {
            setErrorMessage('정산방 이름과 이름을 입력해주세요.');
        } else {
            setErrorMessage(''); 
            try {
                // createRoom을 호출하고 roomId를 반환받음
                const roomId = await createRoom(roomName, userName, count);
                navigate(`/upload/${roomId}`);
            } catch (error) {
                setErrorMessage('방 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
                console.error('방 생성 오류:', error);
            }
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
