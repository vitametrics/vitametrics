import logo from "../assets/logo.png";
const SignUpBanner = () => {
  return (
    <section
      className="w-full h-full flex flex-row box-border sm:flex-col font-leagueSpartanBold sm:p-0"
      id="#act-now"
    >
      <div className="w-full h-full flex flex-row sm:flex-col box-border min-w-[500px] justify-center place-items-center">
        <div className="flex justify-center items-center w-full h-full bg-white p-[100px] slope-right ">
          <img src={logo} className="w-[400px]" />
        </div>
        <div className="flex flex-col justify-center items-center w-full p-[88px] bg-[#4C4C4C] slope">
          <h1 className="text-4xl mb-10 text-white text-center">
            {" "}
            Where do you get started?{" "}
          </h1>
          <button className="p-3 text-3xl flex flex-row gap-2 justify-center text-center items-center rounded-xl w-[230px] bg-pink-gradient text-white">
            Contact
          </button>
        </div>
      </div>
    </section>
  );
};

export default SignUpBanner;
