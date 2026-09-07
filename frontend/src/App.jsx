import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import "./App.css";
import Signup from "./pages/auth/Signup.jsx";
import VerifyEmail from "./pages/auth/VerifyEmail.jsx";
import Login from "./pages/auth/Login.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";

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
            <Route path="/forgot-password" element={<ForgotPassword />}></Route>
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            ></Route>
        </Routes>
    );
}

export default App;
