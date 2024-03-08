import { lazy, Suspense } from "react";
const Navbar = lazy(() => import("../components/Navbar"));
const Banner = lazy(() => import("../components/Banner"));
const Steps = lazy(() => import("../components/Steps"));
const Features = lazy(() => import("../components/Features"));
const SignUpBanner = lazy(() => import("../components/SignUpBanner"));
const Footer = lazy(() => import("../components/Footer"));
const renderLoader = () => <p>Loading</p>;

const Home = () => {
  return (
    <Suspense fallback={renderLoader()}>
      <div className="h-full w-full bg-dark-gradient flex flex-col font-ralewayBold">
        <Navbar />
        <Banner />
        <Steps />
        <Features />
        <SignUpBanner />
        <Footer />
      </div>
    </Suspense>
  );
};

export default Home;
