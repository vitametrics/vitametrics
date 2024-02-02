import Photo from "../assets/images/sample_picture.gif";

const Banner = () => {
  return (
    <section
      id="#home"
      className="w-full h-full flex flex-row box-border mb-28 sm:flex-col"
    >
      <div className="w-[100%] h-full p-20 flex  flex-col box-border min-w-[500px] lg:p-10">
        <h1 className="text-6xl text-[#BA6767] font-bold mb-5 sm:text-center">
          Physiobit
        </h1>
        <p className="text-3xl font-bold text-white">
          {" "}
          Made for research, Physiobit gathers data from real fitbit user
          through their accounts. <br /> <br /> Through continuous logging,
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed <br />{" "}
          <br />
          do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
      <div className="w-[100%] h-full flex justify-center flex-col min-w-[500px] lg:p-10 sm:p-10 pt-20 pb-20 ">
        <img
          src={Photo}
          className="h-[300px] absolute t-10 rounded-2xl sm:relative"
        />
        <div
          className="w-[75%] bg-[#BA6767] h-[350px] ml-auto sm:hidden"
          id="square"
        ></div>
      </div>
    </section>
  );
};

export default Banner;
