import { BrowserRouter, Routes, Route} from "react-router-dom";
import LoginPage from './componentes/Login.js'
import PatientListPage from './componentes/PatientList.js'
import EditPaitentPage from './componentes/EditPatient.js'
import AddEditDailyHealthDataPage from "./componentes/AddEditDailyHealthData.js";
function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/patientlist/:nurseid/:nursePassword" element={<PatientListPage />} />
          <Route path="/editpatient/:patientid" element={<EditPaitentPage />} />
          <Route path="/addeditdailyhealthdata/:patientid/:infoIndex" element={<AddEditDailyHealthDataPage />} />
        </Routes>     
      </div>
    </BrowserRouter>
  );
}

export default App;
