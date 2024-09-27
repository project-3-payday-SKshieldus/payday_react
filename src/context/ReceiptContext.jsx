import { createContext, useContext, useState } from "react";
import receiptData from "../data/receiptData"; // 영수증 더미 데이터
import receipt1 from "../assets/영수증_예시1.png";  // 더미 이미지
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
    const createRoom = (roomName, leaderName, memberCount) => {
        const newRoomId = `${Date.now()}`; // roomId 생성
        const newRoom = {
            roomId: newRoomId,
            roomName,
            leader: leaderName,
            members: [leaderName],  // 리더는 기본적으로 멤버에 포함
            memberCount,
            totalPrice: 0,  // 나중에 정산 시 갱신
            url: `/room/${newRoomId}`,
            receiptData: combinedData  // 더미 영수증 데이터 포함
        };
        setRooms((prevRooms) => [...prevRooms, newRoom]);
        return newRoomId;
    };

    // roomId로 방을 찾는 함수
    const getRoomById = (roomId) => rooms.find(room => room.roomId === roomId);

    // 멤버 추가 함수
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
