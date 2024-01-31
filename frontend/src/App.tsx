import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/UserDashboard"));
const Login = lazy(() => import("./pages/Login"));
const FAQs = lazy(() => import("./pages/FAQs"));
const Register = lazy(() => import("./pages/Register"));
const Contact = lazy(() => import("./pages/Contact"));
const Otp = lazy(() => import("./pages/OTP"));

const LoadingFallback = () => <div>Loading...</div>;

import "./styles.css";

function App() {
  return (
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
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
