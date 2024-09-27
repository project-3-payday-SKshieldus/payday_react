import React, { createContext, useState } from 'react';
import receiptData from '../data/receiptData'; // 영수증 더미 데이터
import receipt1 from '../assets/영수증_예시1.png';
import receipt2 from '../assets/영수증_예시2.png';
import receipt3 from '../assets/영수증_예시3.png';

export const ReceiptContext = createContext();

export const ReceiptProvider = ({ children }) => {
    const [rooms, setRooms] = useState([]);

    // 이미지와 영수증 데이터를 결합
    const combinedData = receiptData.map((data, index) => ({
        ...data,
        image: [receipt1, receipt2, receipt3][index],
    }));

    // 방 생성 함수
    const createRoom = (roomName) => {
        const newRoomId = `${Date.now()}`;  // 방 ID를 타임스탬프로 설정
        const newRoom = {
            roomId: newRoomId,
            roomName,
            receiptData: combinedData,  // 결합된 데이터를 방에 할당
        };
        setRooms(prevRooms => [...prevRooms, newRoom]);
        return newRoomId;  // 생성된 방 ID 반환
    };

    return (
        <ReceiptContext.Provider value={{ rooms, createRoom }}>
            {children}
        </ReceiptContext.Provider>
    );
};
