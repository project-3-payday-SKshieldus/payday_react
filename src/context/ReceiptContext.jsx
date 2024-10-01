import { createContext, useContext, useState } from "react";
import { createRoomApi } from '../api/Api';
import receiptData from "../data/receiptData";
import receipt1 from "../assets/영수증_예시1.png";
import receipt2 from "../assets/영수증_예시2.png";
import receipt3 from "../assets/영수증_예시3.png";

export const ReceiptContext = createContext();

export const useReceipts = () => useContext(ReceiptContext);

export const ReceiptProvider = ({ children }) => {
    const [rooms, setRooms] = useState([]);

    // 더미 이미지 데이터
    const combinedData = receiptData.map((data, index) => ({
        ...data,
        image: [receipt1, receipt2, receipt3][index],
    }));

    // 방 생성 함수
    const createRoom = async (roomName, leaderName, memberCount) => {
        const newRoomId = `${Date.now()}`; // roomId 생성
        const generatedUrl = `/room/${newRoomId}`;
        const newRoom = {
            roomId: newRoomId,
            roomName,
            leader: leaderName,
            members: [leaderName],  // 리더는 기본적으로 멤버에 포함
            memberCount,
            totalPrice: 0,  // 나중에 정산 시 갱신
            generated_url: generatedUrl,
            receiptData: combinedData  // 더미 영수증 데이터 포함
        };

        try {
       
            await createRoomApi(newRoomId, roomName, leaderName, memberCount, generatedUrl);
      
            setRooms((prevRooms) => [...prevRooms, newRoom]);
        } catch (error) {
            console.error('방 생성 중 오류 발생:', error);
            throw error; 
        }

        return newRoomId;
    };

  
    const getRoomById = (roomId) => rooms.find(room => room.roomId === roomId);


    const updateRoomMembers = (roomId, memberName) => {
        setRooms((prevRooms) =>
            prevRooms.map((room) =>
                room.roomId === roomId
                    ? { ...room, members: [...room.members, memberName] }
                    : room
            )
        );
    };

    return (
        <ReceiptContext.Provider value={{ rooms, createRoom, getRoomById, updateRoomMembers }}>
            {children}
        </ReceiptContext.Provider>
    );
};
