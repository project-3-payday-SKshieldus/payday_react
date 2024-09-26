import Receipt from "../component/Receipt";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EnterUserPage.css'

const EnterUserPage = () => {
    const [roomName, setRoomName] = useState('');
    const [userName, setUserName] = useState(''); 
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleStartCalculation = () => {
        if (roomName.trim() === '' || userName.trim() === '') {
            setErrorMessage('이름을 입력해주세요.');
        } else {
            setErrorMessage(''); 
            navigate('/upload');
        }
    };

    useEffect(() => {
        const fetchedUserName = "마시고 죽는 방"; 
        setRoomName(fetchedUserName);
    }, []);

    return (
        <Receipt explanation="이름을 입력하고 정산을 시작하세요!">
            <div className="invite-container">
                <p className="invite-text">환영합니다😊<br />&#39;{roomName}&#39;정산에 초대 되셨습니다.</p>
            </div>

            <div className='start-container'>
                <input
                    className='input-box'
                    placeholder="이름을 입력하세요"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
                {errorMessage && <p className="error-message">{errorMessage}</p>} 
                <button className='button-start' onClick={handleStartCalculation}>정산시작하기</button>
            </div>
        </Receipt>
    );
};

export default EnterUserPage;
