import { lazy, Suspense } from "react";
const Navbar = lazy(() => import("../components/Navbar"));
const Banner = lazy(() => import("../components/Banner"));
const Steps = lazy(() => import("../components/Steps"));
const Features = lazy(() => import("../components/Features"));
//const SignUpBanner = lazy(() => import("../components/SignUpBanner"));
const Footer = lazy(() => import("../components/Footer"));

const Home = () => {
  return (
    <div className="h-full w-full bg-fixed flex flex-col font-leagueSpartanBold">
      <Navbar />
      <Banner />
      <Suspense fallback={<div>Loading...</div>}>
        <Steps />
        <Features />
        <Footer />
      </Suspense>
    </div>
  );
};

export default Home;
