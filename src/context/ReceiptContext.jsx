import { createContext, useContext, useEffect, useState } from "react";
import dummyData from "../data/receiptData.json"; // 더미 데이터 불러오기

export const ReceiptContext = createContext();

export const useReceipts = () => useContext(ReceiptContext);

export const ReceiptProvider = ({ children }) => {
    const [rooms, setRooms] = useState([]);
    const [responseData, setResponseData] = useState(dummyData); // 더미 데이터를 초기값으로 설정

    useEffect(() => {
        // 서버에서 데이터를 받아오거나, 더미 데이터를 사용할 경우 여기에 초기값 설정
        const initialRooms = [
            {
                roomId: "12345",
                roomName: "Test Room",
                leader: "John",
                members: ["John", "Jane"],
                receiptData: dummyData, // 여기서 더미 데이터를 방의 영수증 데이터로 할당
            },
        ];

        setRooms(initialRooms); // 초기값 설정
    }, []);

    // 방 생성 함수
    const createRoom = (roomName, leaderName, memberCount) => {
        const newRoomId = `${Date.now()}`;
        const newRoom = {
            roomId: newRoomId,
            roomName,
            leader: leaderName,
            members: [leaderName],
            memberCount,
            totalPrice: 0,
            url: `/room/${newRoomId}`,
            receiptData: responseData, // 더미 데이터를 방에 할당
        };
        setRooms((prevRooms) => [...prevRooms, newRoom]);
        return newRoomId;
    };

    // roomId로 방을 찾는 함수
    const getRoomById = (roomId) => rooms.find((room) => room.roomId === roomId);

    // 멤버 추가 함수
    const updateRoomMembers = (roomId, memberName) => {
        setRooms((prevRooms) => prevRooms.map((room) => (room.roomId === roomId ? { ...room, members: [...room.members, memberName] } : room)));
    };

    // ResponseData 저장 함수
    const addResponseData = (newData) => {
        setResponseData((prevData) => [...prevData, ...newData]); // 기존 데이터에 새로운 데이터 추가

    };

    // SettlementPage로 전달할 데이터를 가져오는 함수 (조건 없이 모든 데이터를 반환)
    const getResponseDataForRoom = () => {
        return responseData; // 모든 ResponseData를 반환
    };

    return <ReceiptContext.Provider value={{ rooms, createRoom, getRoomById, updateRoomMembers, addResponseData, getResponseDataForRoom }}>{children}</ReceiptContext.Provider>;
};
