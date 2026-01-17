import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";

import Layout from "./components/Layout";
import Login from "./components/Login";
import Signup from "./components/SignupPage";
import Home from "./components/Home";
import FleetManager from "./components/FleetManager";

const App = () => {
  return (
    <Router>
      <Routes>

        {/* -------------------- AUTH -------------------- */}
        <Route path="/nt/login" element={<Login />} />
        <Route path="/nt/register" element={<Signup />} />

        {/* ------------------ PRIVATE ROUTES ------------------ */}
        <Route element={<PrivateRoute app="chat" />}>
          
          {/* Main Layout with Navbar */}
          <Route path="/nt" element={<Layout />}>
            
            {/* Default home page */}
            <Route index element={<Home />} />

            {/* FleetManager page */}
            <Route path="fleets" element={<FleetManager ownerId="OWNER_ID_HERE" />} />

            {/* You can add other private pages here */}
            {/* <Route path="owners" element={<Owners />} /> */}
            {/* <Route path="devices" element={<Devices />} /> */}

          </Route>

          {/* Redirect root to /nt if logged in */}
          <Route path="/" element={<Navigate to="/nt" />} />

        </Route>

        {/* Catch-all for unknown routes */}
        <Route path="*" element={<Navigate to="/nt" />} />

      </Routes>
    </Router>
  );
};

export default App;
