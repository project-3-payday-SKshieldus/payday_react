import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Receipt from './component/Receipt';
import MainPage from './pages/Mainpage';
import UploadPage from './pages/UploadPage';
import EnterUserPage from './pages/EnterUserPage';
import SettleFinishPage from './pages/SettleFinishPage';

function App() {

  return (
    <>
    <BrowserRouter>       
        <Routes>
        <Route path="/" element={<MainPage />}></Route>
          <Route path="/upload" element={<UploadPage />}></Route>
          <Route path="/enterUser" element={<EnterUserPage />}></Route>
          <Route path="/settleFinish" element={<SettleFinishPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
