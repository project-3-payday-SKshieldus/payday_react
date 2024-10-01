import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export const ReceiptContext = createContext();

export const useReceipts = () => useContext(ReceiptContext);

export const ReceiptProvider = ({ children }) => {
    const [currentRoom, setCurrentRoom] = useState(null); // 현재 방의 상세 정보

    // 특정 roomId에 해당하는 방 데이터를 서버에서 가져오는 함수
    const fetchRoomDataFromServer = async (roomId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/room/${roomId}`); // roomId에 해당하는 방 정보 가져오기
            if (!response.ok) {
                // 서버 에러일 경우 상태 코드를 로그로 출력
                console.error(`Error: ${response.status} - ${response.statusText}`);
                throw new Error(`Failed to fetch room data: ${response.status}`);
            }

            const roomData = await response.json(); // JSON 형식의 데이터를 받아옴

            setCurrentRoom(roomData); // 방 정보를 현재 room으로 설정
        } catch (error) {
            console.error("Error fetching room data:", error);
        }
    };
    const updateRoomMembers = async (roomId, memberName) => {
        try {
            const response = await axios.post(`/api/member/${roomId}`, null, {
                params: { memberName },
            });
            console.log
        
        } catch (error) {
            console.error("Failed to add member:", error);
        }
    };

    // 현재 Room 데이터를 반환하는 함수
    const getRoomById = (roomId) => {
        // fetchRoomDataFromServer 함수가 호출된 후 currentRoom이 업데이트되므로
        // 현재 방 정보가 currentRoom과 일치하는지 확인합니다.
        return currentRoom?.roomId === roomId ? currentRoom : null;
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
