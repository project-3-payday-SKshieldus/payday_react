import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Receipt from './component/Receipt';
import MainPage from './pages/MainPage';
import UploadPage from './pages/UploadPage';

function App() {

  return (
    <>
    <BrowserRouter>       
        <Routes>
        <Route path="/" element={<MainPage />}></Route>
          <Route path="/uploadPage" element={<UploadPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
