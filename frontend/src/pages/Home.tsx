import { lazy } from "react";
const Navbar = lazy(() => import("../components/Navigation/Navbar"));
const Banner = lazy(() => import("../components/Home/Banner"));
const Footer = lazy(() => import("../components/Navigation/Footer"));

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
