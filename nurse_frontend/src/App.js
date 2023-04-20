import './css/login.css'
import { BrowserRouter, Routes, Route} from "react-router-dom";
import LoginPage from './componentes/Login.js'


function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          
        </Routes>     
      </div>
    </BrowserRouter>
  );
}

export default App;
