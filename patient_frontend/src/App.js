import { BrowserRouter, Routes, Route} from "react-router-dom";
import LoginPage from './componentes/Login.js'
import UserinfoPage from './componentes/Userinfo.js'
import AddBodyInfoPage from "./componentes/AddBodyInfo.js";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/patientinfo/:patientid/:password" element={<UserinfoPage />} />
          <Route path="/addbodyinfo/:patientid" element={<AddBodyInfoPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
