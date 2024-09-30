import { createContext, useContext, useEffect, useState } from "react";
import dummyData from "../data/receiptData.json"; // 더미 데이터

export const ReceiptContext = createContext();

export const useReceipts = () => useContext(ReceiptContext);

export const ReceiptProvider = ({ children }) => {
    const [rooms, setRooms] = useState([]);
    const [responseData, setResponseData] = useState(dummyData); // 더미 데이터를 초기값으로 설정

    // 방 및 영수증 데이터를 서버에서 가져오는 함수
    const fetchRoomDataFromServer = async () => {
        try {
            const response = await fetch("/api/rooms"); // API 경로 예시
            if (!response.ok) {
                throw new Error("Failed to fetch room data");
            }
            const roomsData = await response.json();
            setRooms(roomsData);
        } catch (error) {
            console.error("Error fetching room data:", error);
        }
    };

    // 배포 시 서버에서 데이터를 가져오는 로직
    useEffect(() => {
        fetchRoomDataFromServer(); // 서버에서 방 데이터를 불러옴
    }, []);

    useEffect(() => {
        // 서버에서 데이터를 받아오거나, 더미 데이터를 사용할 경우 여기에 초기값 설정
        if (import.meta.env.MODE === "development") {
            // Vite에서는 process.env 대신 import.meta.env 사용
            const initialRooms = [
                {
                    roomId: "12345",
                    roomName: "Test Room",
                    leader: "John",
                    members: ["John", "Jane"],
                    receiptData: dummyData, // 개발용 더미 데이터
                },
            ];
            setRooms(initialRooms); // 개발용 데이터 설정
            setResponseData(dummyData);
        } else {
            fetchRoomDataFromServer(); // 배포 환경에서는 서버 데이터를 불러옴
        }
    }, []);

    // 방 정보를 업데이트하는 함수
    const updateRoomData = (roomData) => {
        setRooms((prevRooms) => [...prevRooms.filter((room) => room.roomId !== roomData.roomId), roomData]);
    };

    // 방에 멤버 추가하는 함수
    const updateRoomMembers = (roomId, memberName) => {
        setRooms((prevRooms) => prevRooms.map((room) => (room.roomId === roomId ? { ...room, members: [...room.members, memberName] } : room)));
    };

    // 방을 생성하는 함수 (서버로 POST 요청 보내기)
    const createRoom = async (roomName, leaderName, memberCount) => {
        try {
            const response = await fetch("/api/rooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ roomName, leaderName, memberCount }),
            });
            const newRoom = await response.json();
            setRooms((prevRooms) => [...prevRooms, newRoom]);
            return newRoom.roomId;
        } catch (error) {
            console.error("방 생성 중 오류 발생:", error);
            return null;
        }
    };

    // roomId로 방을 찾는 함수
    const getRoomById = (roomId) => rooms.find((room) => room.roomId === roomId);

    // ResponseData 저장 함수
    const addResponseData = (newData) => {
        setResponseData((prevData) => [...prevData, ...newData]); // 기존 데이터에 새로운 데이터 추가
    };

    // SettlementPage로 전달할 데이터를 가져오는 함수
    const getResponseDataForRoom = (roomId) => {
        const room = rooms.find((room) => room.roomId === roomId);
        return room ? room.receiptData : [];
    };

    return (
        <ReceiptContext.Provider
            value={{
                rooms,
                createRoom,
                getRoomById,
                updateRoomData,
                updateRoomMembers,
                addResponseData,
                getResponseDataForRoom,
            }}
        >
            {children}
        </ReceiptContext.Provider>
    );
};
