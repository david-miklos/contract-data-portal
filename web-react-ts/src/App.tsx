import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import PatientForm from "./PatientForm";
import Contract from "./pages/Contract";

function App() {
  return (
    <>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/patient" element={<PatientForm />} />
          <Route path="/contract" element={<Contract />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
