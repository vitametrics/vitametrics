import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { lazy, Suspense } from "react";
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

const LoadingFallback = () => <div>Loading...</div>;

import "./styles.css";

function App() {
  return (
    <div className="bg-dark-gradient">
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Suspense fallback={<LoadingFallback />}>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/FAQs" component={FAQs} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/contact" component={Contact} />
            <Route path="/otp" component={Otp} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route path="/tos" component={TOS} />
            <Route path="/demo" component={Demo} />
          </Suspense>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
