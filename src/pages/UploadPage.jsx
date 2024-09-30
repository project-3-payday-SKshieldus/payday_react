import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Receipt from "../components/Receipt";
import UploadImage from "../components/UploadImage";
import { useReceipts } from "../context/ReceiptContext"; // ReceiptContext에서 데이터 가져오기
import "./UploadPage.css";

const UploadPage = () => {
    const { roomId } = useParams(); // URL에서 roomId 가져오기
    const { getRoomById, addResponseData } = useReceipts(); // 방 정보를 가져오기 위한 함수
    const navigate = useNavigate();
    const room = getRoomById(roomId);  // roomId로 방을 찾음

    const [uploadedImages, setUploadedImages] = useState([]);

    // 이미지 업로드 후의 처리 함수
    const handleImageUpload = (files) => {
        const fileArray = Array.from(files);

        // 실제 서버에 전송을 막고 더미 데이터로 연습
        // 아래 axios 요청 부분은 실제 API를 사용할 경우 주석을 해제해서 사용
        /*
        const formData = new FormData();
        fileArray.forEach((file, index) => {
            formData.append(`image${index}`, file);
        });

        axios.post(`/flaskapi/upload/${roomId}`, formData)
            .then(response => {
                console.log("이미지 업로드 성공: ", response.data);
                addResponseData(response.data); // 받은 응답을 저장
                navigate(`/room/${roomId}`); // 정산 페이지로 이동
            })
            .catch(error => {
                console.error("이미지 업로드 실패: ", error);
            });
        */

        // 더미 데이터로 처리
        const dummyResponseData = fileArray.map((file, index) => ({
            id: roomId,
            imgURL: URL.createObjectURL(file), // 이미지 미리보기 용도
            ResultimgURL: URL.createObjectURL(file), // 실제 처리된 이미지 대신 동일한 URL 사용 (연습용)
            answer_text: {
                item1: { name: "상품1", price: 1000, quantity: 2 },
                item2: { name: "상품2", price: 2000, quantity: 1 }
            },
            order: index + 1
        }));

        setUploadedImages(dummyResponseData); // 이미지 업로드를 시뮬레이션
        addResponseData(dummyResponseData); // 더미 데이터를 ResponseData에 저장
        navigate(`/room/${roomId}`); // 정산 페이지로 이동
    };

    return (
        <div>
            <Receipt explanation="영수증을 올려주세요.">
                <UploadImage onUpload={handleImageUpload} /> {/* UploadImage 컴포넌트에서 이미지를 받아온다 */}
                <button className="button-mini" onClick={() => handleImageUpload([])}>
                    더미 이미지로 정산 시작하기
                </button>
            </Receipt>
        </div>
    );
};

export default UploadPage;
