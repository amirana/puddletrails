import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";

const LandingPage = lazy(() => import("./pages/LandingPage.jsx"));
const Signup = lazy(() => import("./pages/auth/Signup.jsx"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail.jsx"));
const Login = lazy(() => import("./pages/auth/Login.jsx"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const CreateTrip = lazy(() => import("./pages/trip/CreateTrip.jsx"));
const TripDetails = lazy(() => import("./pages/trip/TripDetails.jsx"));
const Invitation = lazy(() => import("./pages/trip/Invitation.jsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));

function App() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#FFFCF7]" role="status" aria-label="Loading page" />}>
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
                path="/reset-password/:token"
                element={<ResetPassword />}
            ></Route>
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            ></Route>
            <Route
                path="/me"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            ></Route>
            <Route
                path="/create-trip"
                element={
                    <ProtectedRoute>
                        <CreateTrip />
                    </ProtectedRoute>
                }
            ></Route>
            <Route
                path="/trips/:tripId"
                element={
                    <ProtectedRoute>
                        <TripDetails />
                    </ProtectedRoute>
                }
            ></Route>
            <Route path="/invitations/:token" element={<Invitation />}></Route>
            <Route path="/privacy" element={<PrivacyPolicy />}></Route>
        </Routes>
        </Suspense>
    );
}

export default App;
