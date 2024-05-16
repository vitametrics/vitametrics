import React, { ReactNode, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { DashboardProvider } from "./helpers/DashboardContext";
import Home from "./pages/Home"; // Regular import for Home
const Dashboard = lazy(() => import("./pages/UserDashboard"));
const ProjectDashboard = lazy(() => import("./pages/ProjectDashboard")); // Regular import for UserDashboard
const Login = lazy(() => import("./pages/Login"));
const FAQs = lazy(() => import("./pages/FAQs"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TOS = lazy(() => import("./pages/TOS"));
const Demo = lazy(() => import("./pages/Demo"));
const SetPassword = lazy(() => import("./pages/SetPassword"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
import { useAuth } from "./helpers/AuthContext";
import { ProjectProvider } from "./helpers/ProjectContext";
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
    <div className="bg-white">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard">
            <Route
              index={true}
              element={
                <AuthenticatedRoute redirectTo="/login">
                  <Suspense fallback={<LoadingFallback />}>
                    <DashboardProvider>
                      <Dashboard />
                    </DashboardProvider>
                  </Suspense>
                </AuthenticatedRoute>
              }
            />
            <Route
              path="project"
              element={
                <AuthenticatedRoute redirectTo="/login">
                  <Suspense fallback={<LoadingFallback />}>
                    <DashboardProvider>
                      <ProjectProvider>
                        <ProjectDashboard />
                      </ProjectProvider>
                    </DashboardProvider>
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
            path="/FAQs"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <FAQs />
              </Suspense>
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
          <Route
            path="/demo"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Demo />
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
