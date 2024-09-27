import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReceiptProvider } from "./context/ReceiptContext";
import SettlementPage from "./pages/SettlementPage";
import RoomCreationPage from "./pages/RoomCreationPage";

function App() {
    return (
        <ReceiptProvider>
            <Router>
                <Routes>
                    <Route path="/room/:roomId" element={<SettlementPage />} />
                    <Route path="/" element={<RoomCreationPage />} />
                </Routes>
            </Router>
        </ReceiptProvider>
    );
}

export default App;
