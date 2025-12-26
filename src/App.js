import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NtPrivateRoute from "./routes/NtPrivateRoute";


import NtLayout from "./apps/nt/Layout";
import NtLogin from "./apps/nt/Login";
import NtSignup from "./apps/nt/SignupPage";
import NtFriends from "./apps/nt/FileUploadComponent";

const App = () => {
  return (
    <Router>
      <Routes>
       

        {/* --- CHAT --- */}
        <Route path="/nt/login" element={<NtLogin />} />
        <Route path="/nt/register" element={<NtSignup />} />

        <Route element={<NtPrivateRoute app="chat" />}>
          <Route path="/nt" element={<NtLayout />}>
            <Route index element={<NtFriends />} />
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