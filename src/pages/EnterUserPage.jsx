import Receipt from "../components/Receipt";
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from "../components/Footer";
import { useReceipts } from '../context/ReceiptContext';  // 방 정보 가져오기
import './EnterUserPage.css';

const EnterUserPage = () => {
    const { roomId } = useParams();  // roomId를 URL에서 가져옴
    const { getRoomById, updateRoomMembers } = useReceipts();  // 방 정보를 가져오기 위한 함수
    const [roomName, setRoomName] = useState('');
    const [userName, setUserName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const room = getRoomById(roomId);  // roomId로 해당 방을 가져옴
        if (room) {
            setRoomName(room.roomName);  // 방 이름을 설정
        }
    }, [roomId, getRoomById]);

    const handleStartCalculation = () => {
        if (userName.trim() === '') {
            setErrorMessage('이름을 입력해주세요.');
        } else {
            setErrorMessage('');
            localStorage.setItem('userName', userName);  // LocalStorage에 이름 저장
            updateRoomMembers(roomId, userName);  // 방에 사용자를 추가
            // URL에서 guest 부분을 제외하고 /room/:roomId로 이동
            navigate(`/room/${roomId}`);
        }
    };

    return (
        <Receipt explanation="이름을 입력하고 정산을 시작하세요!">
            <div className="invite-container">
                <p className="invite-text">환영합니다😊<br />&#39;{roomName}&#39; 정산에 초대 되셨습니다.</p>
            </div>

            <div className='start-container'>
                <input
                    className='input-box'
                    placeholder="이름을 입력하세요"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
                {errorMessage && <p className="error-message">{errorMessage}</p>} 
                <button className='button-start' onClick={handleStartCalculation}>정산 시작하기</button>
            </div>
            <Footer />
        </Receipt>
    );
};

export default EnterUserPage;
