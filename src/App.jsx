import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReceiptProvider } from "./context/ReceiptContext";
import SettlementPage from "./pages/SettlementPage";
import RoomCreationPage from "./pages/RoomCreationPage";
import Timeline from "./components/timeline";
import MainPage from './pages/Mainpage';
import UploadPage from './pages/UploadPage';
import EnterUserPage from './pages/EnterUserPage';
import SettleFinishPage from './pages/SettleFinishPage';

function App() {
    return (
        <ReceiptProvider>
            <Router>
                <Routes>
                    <Route path="/room/:roomId" element={<SettlementPage />} />
                    <Route path="/" element={<RoomCreationPage />} />
                    <Route path="/timeline" element={<Timeline />}></Route>
                    <Route path="/upload" element={<UploadPage />}></Route>
			        <Route path="/enterUser" element={<EnterUserPage />}></Route>
			        <Route path="/settleFinish" element={<SettleFinishPage />}></Route>
                </Routes>
            </Router>
        </ReceiptProvider>
    );
}

export default App;
