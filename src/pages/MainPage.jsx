import Receipt from "../component/Receipt";
import { useState } from 'react';
import './MainPage.css'

const MainPage = () => {

    const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    if (count > 0) {
      setCount(count - 1);
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
                <input className='input-box' placeholder="정산방 이름을 작성해주세요" />
                <input className='input-box' placeholder="이름을 입력하세요" />
                <button className='button-start'>정산시작하기</button>
            </div>
        </Receipt>
    );
  };

  export default MainPage;