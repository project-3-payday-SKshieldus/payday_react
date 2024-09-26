import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import SettlementPage from "./page/SettlementPage";

function App() {
  return (
    <>
     <BrowserRouter>       
        <Routes>
          <Route path="/settle" element={<SettlementPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
