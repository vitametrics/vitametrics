import Navbar from "../components/Navbar";

const PageNotFound = () => {
  return (
    <div className="h-screen w-screen bg-fixed flex flex-col font-neueHassUnica">
      <Navbar />
      <div className="w-full h-full justify-center items-center flex text-5xl text-primary flex-col">
        404 NOT FOUND.
      </div>
    </div>
  );
};
export default PageNotFound;
