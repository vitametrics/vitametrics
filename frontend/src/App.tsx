import React, { ReactNode, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { DashboardProvider } from "./helpers/DashboardContext";
import Home from "./pages/Home";
const Dashboard = lazy(() => import("./pages/UserDashboard"));
const Login = lazy(() => import("./pages/Login"));
const Demo = lazy(() => import("./pages/Demo"));
const SetPassword = lazy(() => import("./pages/SetPassword"));
import { useAuth } from "./helpers/AuthContext";
const LoadingFallback = () => <div>Loading...</div>;
interface AuthRouteProps {
  children: ReactNode;
  redirectTo: string;
}

function App() {
  const AuthenticatedRoute: React.FC<AuthRouteProps> = ({
    children,
    redirectTo,
  }) => {
    const { isAuthenticated, isLoadingAuth } = useAuth();
    if (isLoadingAuth) {
      return null; // Or a minimal placeholder that doesn't change layout dramatically
    }
    return isAuthenticated ? children : <Navigate to={redirectTo} />;
  };

  const UnauthenticatedRoute: React.FC<AuthRouteProps> = ({
    children,
    redirectTo,
  }) => {
    const { isAuthenticated, isLoadingAuth } = useAuth();
    if (isLoadingAuth) {
      return null;
    }
    return !isAuthenticated ? children : <Navigate to={redirectTo} />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <AuthenticatedRoute redirectTo="/login">
              <Suspense fallback={<LoadingFallback />}>
                <DashboardProvider>
                  <Dashboard />
                </DashboardProvider>
              </Suspense>
            </AuthenticatedRoute>
          }
        ></Route>
        <Route
          path="/login"
          element={
            <UnauthenticatedRoute redirectTo="/dashboard?view=data">
              <Suspense fallback={<LoadingFallback />}>
                <Login />
              </Suspense>
            </UnauthenticatedRoute>
          }
        />

        <Route
          path="/demo"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Demo />
            </Suspense>
          }
        />

        <Route
          path="/set-password"
          element={
            <UnauthenticatedRoute redirectTo="/dashboard">
              <Suspense fallback={<LoadingFallback />}>
                <SetPassword />
              </Suspense>
            </UnauthenticatedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
