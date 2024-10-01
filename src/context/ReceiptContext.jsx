import { createContext, useContext, useState } from "react";
import { createRoomApi } from '../api/Api';
import receiptData from "../data/receiptData";
import receipt1 from "../assets/영수증_예시1.png";
import receipt2 from "../assets/영수증_예시2.png";
import receipt3 from "../assets/영수증_예시3.png";
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
