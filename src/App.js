// ============================
// App.js updated with Fleets route
// ============================
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";

import Layout from "./components/Layout";
import Login from "./components/Login";
import Signup from "./components/SignupPage";
import Home from "./components/Home";
import FleetManager from "./components/FleetManager"; // <-- Fleet page import

const App = () => {
  return (
    <Router>
      <Routes>
        {/* --- AUTH --- */}
        <Route path="/nt/login" element={<Login />} />
        <Route path="/nt/register" element={<Signup />} />

        <Route element={<PrivateRoute app="chat" />}>
          {/* --- MAIN LAYOUT --- */}
          <Route path="/nt" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="fleets" element={<FleetManager ownerId="OWNER_ID_HERE" />} /> {/* Fleet route */}
          </Route>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
