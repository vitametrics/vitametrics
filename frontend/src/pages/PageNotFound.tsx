import Navbar from "../components/Navigation/Navbar";
import Footer from "../components/Navigation/Footer";
import { Fragment } from "react";

const PageNotFound = () => {
  return (
    <Fragment>
      <div className="h-screen w-screen bg-fixed flex flex-col font-neueHassUnica">
        <Navbar />
        <div className="w-full h-full justify-center items-center flex  text-primary flex-col font-bold">
          <h1 className="text-5xl">404 NOT FOUND.</h1>
          <p className="text-center text-secondary mt-5 text-lg">
            Looks like you're running in the wrong place!
          </p>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
};
export default PageNotFound;
