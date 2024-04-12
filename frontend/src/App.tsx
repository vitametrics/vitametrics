import React, { ReactNode } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { DashboardProvider } from "./helpers/DashboardContext";


//import { AuthProvider } from "./helpers/AuthContext";



const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/UserDashboard"));
const Login = lazy(() => import("./pages/Login"));
const FAQs = lazy(() => import("./pages/FAQs"));
const Register = lazy(() => import("./pages/Register"));
const Contact = lazy(() => import("./pages/Contact"));
const Otp = lazy(() => import("./pages/OTP"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TOS = lazy(() => import("./pages/TOS"));
const Demo = lazy(() => import("./pages/Demo"));

/*
import Home from "./pages/Home";
import Dashboard from "./pages/UserDashboard";
import Login from "./pages/Login";
import FAQs from "./pages/FAQs";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import Otp from "./pages/OTP";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TOS from "./pages/TOS";
import Demo from "./pages/Demo";
*/
import { useAuth } from "./helpers/AuthContext";

const LoadingFallback = () => <div>Loading...</div>;

import "./styles.css";
interface AuthRouteProps {
  children: ReactNode;
  redirectTo: string;
}

function App() {

  const AuthenticatedRoute:React.FC<AuthRouteProps> = ({ children, redirectTo }) => {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  if (isLoadingAuth) {
    return null;  // Or a minimal placeholder that doesn't change layout dramatically
  }
  return isAuthenticated ? children : <Navigate to={redirectTo} />;
};

const UnauthenticatedRoute:React.FC<AuthRouteProps> = ({ children, redirectTo }) => {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  if (isLoadingAuth) {
    return null;
  }
  return !isAuthenticated ? children : <Navigate to={redirectTo} />;
};

  return (
    <div className="bg-dark-gradient">
      <Router>
      <Suspense fallback={<LoadingFallback />}>
    <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={
              <AuthenticatedRoute redirectTo="/login">
                <DashboardProvider>
                <Dashboard />
                </DashboardProvider>
              </AuthenticatedRoute>
            }> 
            
            </Route>
            <Route path="/login" element={
              <UnauthenticatedRoute redirectTo="/dashboard?view=data">
                <Login />
              </UnauthenticatedRoute>
            } />
          <Route path="/FAQs" element={<FAQs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/tos" element={<TOS />} />
          <Route path="/demo" element={<Demo />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
