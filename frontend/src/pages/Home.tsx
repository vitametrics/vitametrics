import { lazy } from "react";
const Navbar = lazy(() => import("../components/Navbar"));
const Banner = lazy(() => import("../components/Banner"));
const Footer = lazy(() => import("../components/Footer"));

const Home = () => {
  return (
    <div className="h-full w-full bg-fixed flex flex-col font-neueHassUnica">
      <Navbar />
      <Banner />
      <Footer />
    </div>
  );
};

export default Home;
