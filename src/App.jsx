import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Timeline from "./components/timeline";

function App() {
  return (
<>
     <BrowserRouter>       
        <Routes>
          <Route path="/timeline" element={<Timeline />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
