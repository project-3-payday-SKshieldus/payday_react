import Receipt from "../components/Receipt"; 
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from "../components/Footer";
import { useReceipts } from '../context/ReceiptContext';  // context를 업데이트하기 위한 함수
import './EnterUserPage.css';

const EnterUserPage = () => {
    const { roomId } = useParams();  // roomId를 URL에서 가져옴
    const { updateRoomData, updateRoomMembers } = useReceipts();  // 방 정보를 업데이트하기 위한 함수
    const [roomName, setRoomName] = useState('');
    const [userName, setUserName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // 방 정보를 서버로부터 받아오는 함수
        const fetchRoomData = async () => {
            try {
                const response = await fetch(`/api/rooms/${roomId}`);
                if (!response.ok) {
                    throw new Error('방 정보를 불러오지 못했습니다.');
                }
                const roomData = await response.json();
                setRoomName(roomData.roomName);  // 방 이름 설정
                updateRoomData(roomData);  // context에 방 정보 저장
            } catch (error) {
                console.error('방 정보를 불러오지 못했습니다:', error);
                setErrorMessage('방 정보를 불러오지 못했습니다. 다시 시도해주세요.');
            }
        };
        fetchRoomData();
    }, [roomId, updateRoomData]);

    const handleStartCalculation = async () => {
        if (userName.trim() === '') {
            setErrorMessage('이름을 입력해주세요.');
        } else {
            setErrorMessage('');
            localStorage.setItem('userName', userName);  // LocalStorage에 이름 저장
            try {
                // 본인 이름을 API로 Room의 멤버로 추가
                const response = await fetch(`/api/rooms/${roomId}/add-member`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userName }),
                });

                if (!response.ok) {
                    throw new Error('멤버 추가에 실패했습니다.');
                }

                updateRoomMembers(roomId, userName);  // context에 멤버 정보 업데이트
                navigate(`/room/${roomId}`);  // Room 페이지로 이동
            } catch (error) {
                console.error('멤버 추가 실패:', error);
                setErrorMessage('멤버를 추가하는 중 오류가 발생했습니다.');
            }
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
