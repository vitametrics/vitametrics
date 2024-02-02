const SignUpBanner = () => {
  return (
    <section
      className="w-full h-full flex flex-row box-border p-10 sm:flex-col bg-[#2B2730] sm:p-0"
      id="#act-now"
    >
      <div className="w-[100%] h-full p-10 flex  flex-col box-border min-w-[500px] lg:p-10 justify-center place-items-center gap-[30px]">
        <h3 className="text-5xl  text-[#ffffff] font-bold mb-5 sm:text-center text-center">
          Doing Research?
        </h3>
        <a href="/contact">
          <button className="bg-[#BA6767] font-bold text-3xl text-white px-10 py-3 rounded-md">
            {" "}
            Sign Up Now!
          </button>
        </a>
      </div>
    </section>
  );
};

export default SignUpBanner;
