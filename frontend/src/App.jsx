import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import "./App.css";
import Signup from "./pages/auth/Signup.jsx";
import VerifyEmail from "./pages/auth/VerifyEmail.jsx";
import Login from "./pages/auth/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route
                path="/verify-email/:token"
                element={<VerifyEmail />}
            ></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/dashboard" element={<Dashboard />}></Route>
        </Routes>
    );
}

export default App;
