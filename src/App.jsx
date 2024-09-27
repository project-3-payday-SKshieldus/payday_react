import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReceiptProvider } from "./context/ReceiptContext";
import SettlementPage from "./pages/SettlementPage";
import RoomCreationPage from "./pages/RoomCreationPage";
import Timeline from "./components/timeline";

function App() {
    return (
        <ReceiptProvider>
            <Router>
                <Routes>
                    <Route path="/room/:roomId" element={<SettlementPage />} />
                    <Route path="/" element={<RoomCreationPage />} />
                    <Route path="/timeline" element={<Timeline />}></Route>
                </Routes>
            </Router>
        </ReceiptProvider>
    );
}

export default App;
