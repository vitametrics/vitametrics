import { lazy } from "react";
const Navbar = lazy(() => import("../components/Navbar"));
const Banner = lazy(() => import("../components/Banner"));

const Home = () => {
  return (
    <div className="h-full w-full bg-fixed font-leagueSpartanBold overflow-y-hidden">
      <Navbar />
      <Banner />
    </div>
  );
};

export default Home;
