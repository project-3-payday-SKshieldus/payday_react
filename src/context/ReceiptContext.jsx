import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

export const ReceiptContext = createContext();

export const useReceipts = () => useContext(ReceiptContext);

export const ReceiptProvider = ({ children }) => {
    const [currentRoom, setCurrentRoom] = useState(null); // 현재 방의 상세 정보

    // 특정 roomId에 해당하는 방 데이터를 서버에서 가져오는 함수
    const fetchRoomDataFromServer = async (roomId) => {
        try {
            const response = await fetch(`/api/room/${roomId}`); // roomId에 해당하는 방 정보 가져오기
            if (!response.ok) {
                throw new Error("Failed to fetch room data");
            }
            const roomData = await response.json();
            setCurrentRoom(roomData); // 방 정보를 현재 room으로 설정
        } catch (error) {
            console.error("Error fetching room data:", error);
        }
    };

    // 방에 멤버 추가하는 함수
    const updateRoomMembers = (roomId, memberName) => {
        setCurrentRoom((prevRoom) => ({
            ...prevRoom,
            members: [...prevRoom.members, memberName],
        }));
    };

    // 특정 roomId로 방을 찾는 함수
    const getRoomById = (roomId) => {
        return currentRoom && currentRoom.roomId === roomId ? currentRoom : null;
    };

    return (
        <ReceiptContext.Provider
            value={{
                currentRoom,
                fetchRoomDataFromServer,
                getRoomById,
                updateRoomMembers,
            }}
        >
            {children}
        </ReceiptContext.Provider>
    );
};

// PropTypes 추가
ReceiptProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
