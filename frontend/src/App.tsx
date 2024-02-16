import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./helpers/AuthContext";

const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/UserDashboard"));
const Login = lazy(() => import("./pages/Login"));
const FAQs = lazy(() => import("./pages/FAQs"));
const Register = lazy(() => import("./pages/Register"));
const Contact = lazy(() => import("./pages/Contact"));
const Otp = lazy(() => import("./pages/OTP"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

const LoadingFallback = () => <div>Loading...</div>;

import "./styles.css";

function App() {
  return (
    <AuthProvider>
      <div className="bg-[#E4E4E4] dark:bg-[#1E1D20]">
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/dashboard" exact component={Dashboard} />
              <Route path="/FAQs" exact component={FAQs} />
              <Route path="/login" exact component={Login} />
              <Route path="/register" exact component={Register} />
              <Route path="/contact" exact component={Contact} />
              <Route path="/otp" exact component={Otp} />
              <Route path="/privacy-policy" exact component={PrivacyPolicy} />
            </Switch>
          </Suspense>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
