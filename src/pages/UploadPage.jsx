import { useNavigate, useParams } from "react-router-dom";
import { useReceipts } from "../context/ReceiptContext"; // ReceiptContext에서 데이터 가져오기
import Receipt from "../components/Receipt";
import UploadImage from "../components/UploadImage";
import "./UploadPage.css";

const UploadPage = () => {
    const { roomId } = useParams(); // URL에서 roomId 가져오기
    const { getRoomById } = useReceipts(); // 방 정보를 가져오기 위한 함수
    const navigate = useNavigate();
    const room = getRoomById(roomId);  // roomId로 방을 찾음

    if (!room) {
        console.error(`Room with ID ${roomId} not found.`);
        return;
    }
    
    // 방을 찾았을 때만 이미지 데이터를 처리
    const handleImageUpload = () => {
        const dummyImages = room.receiptData.map(data => data.image);  // 더미 이미지 사용
        console.log('업로드된 이미지: ', dummyImages);  // 업로드된 이미지 URL을 콘솔로 출력
        navigate(`/room/${roomId}`, { state: { images: dummyImages } });  // 정산 페이지로 이동
    }

    return (
        <div>
            <Receipt explanation="영수증을 올려주세요. (더미 이미지 사용)">
                <UploadImage />
                <button className='button-mini' onClick={handleImageUpload}>정산 하러가기</button> {/* 더미 이미지 업로드 후 정산 페이지로 이동 */}
            </Receipt>
        </div>
    );
};

export default UploadPage;
