import logo1 from "../assets/images/logo1.png";

const OTP = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-[500px] h-[700px] bg-[#FFFFFF] z-10 flex flex-col">
        <div className="flex flex-row w-full text-center items-center justify-center p-5 bg-[#BA6767]">
          <img src={logo1} className="w-[50%] h-30" alt="Physiobit Logo" />
        </div>
        <div className="w-full text-center p-5 bg-[#613a3a]">
          <h1 className="font-ralewayBold text-[#fff3f3] text-2xl ">
            {" "}
            YOUR ACCOUNT CREDENTIALS{" "}
          </h1>
        </div>
        <div className="w-full text-left p-5 bg-[#fff3f3]">
          <h1 className="font-ralewayBold text-[#1F1C23] text-xl mb-5 ">
            Hello Angel, <br />
            <br />
            Your account has been created successfully. Please safely store your
            details below. Thank you for using Physiobit. Happy researching!{" "}
            <br />
            <br />
          </h1>
          <h1 className="font-ralewayBold text-[#613a3a] text-xl ">
            EMAIL:{" "}
            <span className="text-[#1F1C23]">
              {" "}
              organizationemail@gmail.com{" "}
            </span>
          </h1>

          <h1 className="font-ralewayBold text-[#613a3a] text-xl ">
            PASSWORD:{" "}
            <span className="text-[#1F1C23]"> NGKAGL@@$_2$+$-2+ </span>
          </h1>

          <h1 className="font-ralewayBold text-[#613a3a] text-xl ">
            INVITE CODE: <span className="text-[#1F1C23]"> 6969696 </span>
          </h1>
          <div className="flex items-center justify-center mt-10">
            <button className="font-ralewayBold bg-[#BA6767] p-3 text-[#FFFF] rounded-lg w-[80%]">
              {" "}
              REGISTER{" "}
            </button>
          </div>
        </div>
        <footer className="bg-[#1F1C23] dark:bg-[#1F1C23]">
          <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
            <div className="sm:flex flex sm:items-center sm:justify-between">
              <a
                href="https://flowbite.com/"
                className="flex items-center  sm:mb-0 space-x-3 rtl:space-x-reverse"
              >
                <img src={logo1} className="h-8" alt="Physiobit Logo" />
                <div className="flex flex-col">
                  <span className="text-base text-white sm:hidden font-semibold">
                    {" "}
                  </span>
                </div>
              </a>
              <ul className="flex flex-wrap items-center ml-auto text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                <li>
                  <a href="/" className="hover:underline me-4 md:me-6">
                    How it works
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy-policy"
                    className="hover:underline me-4 md:me-6"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/FAQs" className="hover:underline me-4 md:me-6">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="/credits" className="hover:underline">
                    Credits
                  </a>
                </li>
              </ul>
            </div>
            <div className="mt-5 text-gray-500 font-ralewayBold text-center w-full">
              This email was sent to name@gmail.com. <br />
              Please do not reply to this email as it is not monitored.
            </div>
            <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
            <span className="block text-sm text-gray-500 text-center sm:text-center dark:text-gray-400">
              © 2024{" "}
              <a href="/" className="hover:underline gap-10">
                Physiobit™
              </a>
              All Rights Reserved.
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default OTP;
