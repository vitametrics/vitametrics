import { lazy, Suspense } from "react";
const Navbar = lazy(() => import("../components/Navbar"));
const Banner = lazy(() => import("../components/Banner"));
//const SignUpBanner = lazy(() => import("../components/SignUpBanner"));
const Footer = lazy(() => import("../components/Footer"));

const Home = () => {
  return (
    <div className="h-full w-full bg-fixed flex flex-col font-leagueSpartanBold">
      <Navbar />
      <Banner />
      <Suspense fallback={<div>Loading...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Home;
