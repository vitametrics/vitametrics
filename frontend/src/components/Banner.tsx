import Graph from "../assets/Graph";
import GithubSmallIcon from "../assets/GithubSmallIcon";

const Banner = () => {
  return (
    <section
      id="#home"
      className="w-full h-full flex flex-row box-border mb-28 mt-10 sm:flex-col bg-dark-gradient font-leagueSpartanBold"
    >
      <div className="w-[100%] h-full p-20 flex flex-col box-border min-w-[500px] lg:p-10">
        <h1 className="text-6xl text-white font-bold mb-5 sm:text-center">
          A Better Way
        </h1>
        <h2 className="gradient-light-blue font-bold mb-5 sm:text-center text-5xl">
          to analyze fitness data
        </h2>
        <p className="text-4xl font-bold text-white">
          {" "}
          Expand your research potential using Fitbit devices and our intuitive
          dashboard made for researchers like you.
        </p>
        <div className="flex flex-row gap-5 mt-10">
          <button className="p-3 text-3xl flex flex-row gap-2 justify-center items-center rounded-xl w-[230px] bg-pink-gradient text-white">
            Contact
          </button>
          <button className="p-3 text-3xl flex flex-row justify-center gap-2 items-center rounded-xl w-[230px] bg-[#D9D9D9] text-black">
            <GithubSmallIcon />
            Github
          </button>
        </div>
      </div>
      <div className="w-full h-full flex justify-center flex-col min-w-[500px] lg:p-10 sm:p-10 pt-20 pb-20 items-center ">
        <Graph />
      </div>
    </section>
  );
};

export default Banner;
