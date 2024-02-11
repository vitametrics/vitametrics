import Graph from "../assets/Graph";

const Banner = () => {
  return (
    <section
      id="#home"
      className="w-full h-full flex flex-row box-border mb-28 sm:flex-col dark:bg-hero-texture"
    >
      <div className="w-[100%] h-full p-20 flex  flex-col box-border min-w-[500px] lg:p-10">
        <h1 className="text-6xl text-[#5086A2] dark:text-[#BA6767] font-bold mb-5 sm:text-center">
          Physiobit
        </h1>
        <p className="text-3xl font-bold text-[#373F51] dark:text-white">
          {" "}
          Made for research, Physiobit gathers data from real fitbit user
          through their accounts. <br /> <br /> Through continuous logging,
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed <br />{" "}
          <br />
          do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
      <div className="w-full h-full flex justify-center flex-col min-w-[500px] lg:p-10 sm:p-10 pt-20 pb-20 items-center ">
        <div
          className="w-[85%] bg-[#79a3b7] dark:bg-[#BA6767] h-[450px] rounded-xl sm:hidden flex justify-center items-center "
          id="square"
        >
          <Graph />
        </div>
      </div>
    </section>
  );
};

export default Banner;
