import React, { ReactNode, lazy, Suspense } from "react";
import "./output.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home"; // Regular import for Home
const Dashboard = lazy(() => import("./pages/UserDashboard"));
const ProjectDashboard = lazy(() => import("./pages/ProjectDashboard"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TOS = lazy(() => import("./pages/TOS"));
const SetPassword = lazy(() => import("./pages/SetPassword"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const Settings = lazy(() => import("./pages/Settings"));
const Admin = lazy(() => import("./pages/Admin"));
import { useAuth } from "./helpers/AuthContext";
import { ProjectProvider } from "./helpers/ProjectContext";
import { GridLoader } from "react-spinners";
import Notification from "./components/Notification/Notification";

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <GridLoader color="#EF8759" />
  </div>
);
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
      return null;
    }
    return isAuthenticated ? children : <Navigate to={redirectTo} />;
  };

  const AdminRoute: React.FC<AuthRouteProps> = ({ children, redirectTo }) => {
    const { isAuthenticated, isLoadingAuth, isOwner } = useAuth();
    if (isLoadingAuth) {
      return null;
    }
    return isAuthenticated && isOwner ? children : <Navigate to={redirectTo} />;
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
    <div className="bg-white">
      <Notification />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard">
            <Route
              index={true}
              element={
                <AuthenticatedRoute redirectTo="/login">
                  <Suspense fallback={<LoadingFallback />}>
                    <Dashboard />
                  </Suspense>
                </AuthenticatedRoute>
              }
            />
            <Route
              path="settings"
              element={
                <AuthenticatedRoute redirectTo="/login">
                  <Suspense fallback={<LoadingFallback />}>
                    <ProjectProvider>
                      <Settings />
                    </ProjectProvider>
                  </Suspense>
                </AuthenticatedRoute>
              }
            />
            <Route
              path="admin"
              element={
                <AdminRoute redirectTo="/login">
                  <Suspense fallback={<LoadingFallback />}>
                    <Admin />
                  </Suspense>
                </AdminRoute>
              }
            />
            <Route
              path="project"
              element={
                <AuthenticatedRoute redirectTo="/login">
                  <Suspense fallback={<LoadingFallback />}>
                    <ProjectProvider>
                      <ProjectDashboard />
                    </ProjectProvider>
                  </Suspense>
                </AuthenticatedRoute>
              }
            />
          </Route>

          <Route
            path="/login"
            element={
              <UnauthenticatedRoute redirectTo="/dashboard">
                <Suspense fallback={<LoadingFallback />}>
                  <Login />
                </Suspense>
              </UnauthenticatedRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <UnauthenticatedRoute redirectTo="/dashboard">
                <Suspense fallback={<LoadingFallback />}>
                  <ForgotPassword />
                </Suspense>
              </UnauthenticatedRoute>
            }
          />

          <Route
            path="/privacy-policy"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <PrivacyPolicy />
              </Suspense>
            }
          />
          <Route
            path="/tos"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <TOS />
              </Suspense>
            }
          />

          <Route path="*" element={<PageNotFound />} />

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
    </div>
  );
}

export default App;
