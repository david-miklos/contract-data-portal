import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import PatientForm from "./pages/Patient";
import Contract from "./pages/Contract";
import ContractDetails from "./pages/ContractDetails";

function App() {
  return (
    <>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/patient" element={<PatientForm />} />
          <Route path="/contract" element={<Contract />} />
          <Route path="/contract/details/:id" element={<ContractDetails />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
