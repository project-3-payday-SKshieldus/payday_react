import Receipt from "../component/Receipt";
import UploadImage from "../component/UploadImage";
import { useNavigate } from 'react-router-dom';
import './UploadPage.css'

const UploadPage = () => {
    const navigate = useNavigate();
    
    const handleStartCalculation = () => {
        navigate('/uploadPage');
    };


    return (
        <Receipt explanation="영수증을 올려주세요.">
            <UploadImage></UploadImage>
            <button className='button-mini' onClick={handleStartCalculation}>정산 하러가기</button>
        </Receipt>
    );
  };

  export default UploadPage;