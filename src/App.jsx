import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Receipt from './component/Receipt';
import MainPage from './pages/MainPage';
import UploadPage from './pages/UploadPage';
import EnterUserPage from './pages/EnterUserPage';

function App() {

  return (
    <>
    <BrowserRouter>       
        <Routes>
        <Route path="/" element={<MainPage />}></Route>
          <Route path="/upload" element={<UploadPage />}></Route>
          <Route path="/enterUser" element={<EnterUserPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
