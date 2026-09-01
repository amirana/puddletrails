import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import "./App.css";
import Signup from "./pages/auth/Signup.jsx";
import VerifyEmail from "./pages/auth/VerifyEmail.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />}></Route>
                <Route path="/signup" element={<Signup />}></Route>
                <Route
                    path="/verify-email/:token"
                    element={<VerifyEmail />}
                ></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
