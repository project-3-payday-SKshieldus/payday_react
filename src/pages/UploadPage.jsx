import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReceipts } from "../context/ReceiptContext";
import Receipt from "../components/Receipt";
import UploadImage from "../components/UploadImage";
import { useReceipts } from "../context/ReceiptContext"; // ReceiptContext에서 데이터 가져오기
import "./UploadPage.css";

const UploadPage = () => {
  const { roomId } = useParams();
  const { getRoomById } = useReceipts();
  const navigate = useNavigate();
  const room = getRoomById(roomId);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]); 

  if (!room) {
    console.error(`Room with ID ${roomId} not found.`);
    return;
  }

  const handleImageChange = (images) => {
    setSelectedImages(images);
  };

  const handleImageUpload = async () => {
    if (selectedImages.length === 0) {
      console.error("이미지를 선택해주세요.");
      return;
    }

    try {
      const formData = new FormData();
      selectedImages.forEach((image, index) => {
        formData.append('image', image.file);
      });

      const response = await fetch(`http://localhost:5000/flaskapi/upload/${roomId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error("이미지 업로드 실패");
      }

      const result = await response.json();
      console.log('업로드된 이미지 URL: ', result.imageUrl);
      setIsPopupVisible(true);
    } catch (error) {
      console.error("이미지 업로드 오류: ", error);
    }
  };

  const handlePopupConfirm = () => {
    setIsPopupVisible(false);
    navigate(`/room/${roomId}`, { state: { images: selectedImages.map(data => data.dataUrl) } });
  };

  const handlePopupClose = () => {
    setIsPopupVisible(false);
  };

  return (
    <div>
      <Receipt explanation="영수증을 올려주세요. (더미 이미지 사용)">
        <UploadImage onImagesChange={handleImageChange} />
        <button className='button-mini' onClick={handleImageUpload}>정산 하러가기</button>

        {isPopupVisible && (
          <div className="popup-overlay">
            <div className="popup-container">
              <button className="popup-close-button" onClick={handlePopupClose}>&times;</button>
              <p className="popup-p">이미지가 업로드되었습니다.</p>
              <button className="popup-confirm-button" onClick={handlePopupConfirm}>확인</button>
            </div>
          </div>
        )}
      </Receipt>
    </div>
  );
};

export default UploadPage;
