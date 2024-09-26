import React from "react";

const ImageModal = ({ src, onClose }) => (
    <div className="modal-overlay">
        <div className="modal-content">
            <img src={src} alt="영수증 이미지" style={{ width: "700px", height: "700px" }} />
            <button onClick={onClose} style={{ margin: "10px" }}>
                닫기
            </button>
        </div>
    </div>
);

export default ImageModal;
