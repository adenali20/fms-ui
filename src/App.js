// ============================
// App.js updated with Fleets route
// ============================
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NtPrivateRoute from "./routes/NtPrivateRoute";

import NtLayout from "./apps/Layout";
import NtLogin from "./apps/Login";
import NtSignup from "./apps/SignupPage";
import NtFriends from "./apps/Home";
import FleetManager from "./apps/FleetManager"; // <-- Fleet page import

const App = () => {
  return (
    <Router>
      <Routes>
        {/* --- AUTH --- */}
        <Route path="/nt/login" element={<NtLogin />} />
        <Route path="/nt/register" element={<NtSignup />} />

        <Route element={<NtPrivateRoute app="chat" />}>
          {/* --- MAIN LAYOUT --- */}
          <Route path="/nt" element={<NtLayout />}>
            <Route index element={<NtFriends />} />
            <Route path="fleets" element={<FleetManager ownerId="OWNER_ID_HERE" />} /> {/* Fleet route */}
          </Route>
          <Route path="/" element={<NtLayout />}>
            <Route index element={<NtFriends />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
