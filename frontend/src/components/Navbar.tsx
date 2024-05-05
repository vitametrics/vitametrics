import { useState, useEffect } from "react";
import { useAuth } from "../helpers/AuthContext";
import { useNavigate } from "react-router-dom";
import imagePath from "../assets/images/vitamix.webp";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav className="bg-transparent px-10 md:px-32 py-5 nav fixed top-0 w-full z-50 animated-parent font-leagueSpartanBold">
      <div className="flex flex-row w-full bg-glass rounded-xl top-0 flex-wrap items-center justify-between mx-auto p-3 animated-container">
        <a
          href="/"
          className="flex items-center space-x-3 rtl:space-x-rev  erse"
        >
          <img
            fetchPriority="high"
            src={imagePath}
            className="h-10 w-[145px] rounded-xl border-primary"
            alt="VitametricsLogo"
          />
        </a>
        {windowWidth <= 755 ? (
          <>
            <button
              onClick={toggleDropdown}
              data-collapse-toggle="navbar-dropdown"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-dropdown"
              aria-expanded={isDropdownOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
            <div
              className={`${
                isDropdownOpen ? "block" : "hidden"
              } w-full md:hidden mt-4 border border-gray-100  rounded-lg bg-transparent md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-[#1F1C23] md:dark:bg-[#1F1C23] dark:border-[#1F1C23]`}
              id="navbar-dropdown"
            >
              <ul className="flex flex-col font-medium p-4 md:p-0">
                <li>
                  <button
                    onClick={() => navigate("/")}
                    className="block py-2 px-3 text-xl"
                  >
                    Home
                  </button>
                </li>

                {isAuthenticated ? (
                  <li>
                    <a href="/dashboard" className="block py-2 px-3  text-xl">
                      Dashboard
                    </a>
                  </li>
                ) : (
                  <li>
                    <button
                      onClick={() => navigate("/login")}
                      className="block py-2 px-3 text-xl"
                    >
                      Login
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </>
        ) : (
          <div
            className="hidden w-full md:block md:w-auto bg-transparent"
            id="navbar-default"
          >
            <ul className="font-medium flex flex-col justify-center items-center p-4 md:p-0 mt-4 border border-gray-100 rounded-lg  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 dark:bg-transparent md:dark:bg-transparent">
              <li>
                <a
                  href="/demo?view=data"
                  className="block py-2 px-3 text-2xl  hover:text-gray-300 bg-transparent rounded md:bg-transparent  md:p-0  "
                  aria-current="page"
                >
                  Demo
                </a>
              </li>

              {isAuthenticated ? (
                <li>
                  <a
                    href="/dashboard?view=data"
                    className="block py-2 px-3 text-2xl  rounded hover:text-gray-300 md:hover:bg-transparent md:border-0 md:hover:text-gray-300 md:p-0  md:dark:hover:text-grey-200 dark:hover:bg-gray-700 dark:hover: md:dark:hover:bg-transparent"
                  >
                    <svg
                      width={50}
                      height={44}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M50 22C50 9.87 38.785 0 25 0 11.216 0 0 9.87 0 22c0 6.407 3.13 12.182 8.115 16.206l-.024.019.81.601c.054.04.11.072.164.11.43.314.877.613 1.331.902.148.093.295.187.445.278.485.294.984.574 1.493.838.11.058.222.114.334.17.558.28 1.127.542 1.71.784.042.018.086.034.128.051 1.9.777 3.927 1.347 6.047 1.684l.167.027c.658.1 1.324.18 1.997.233.082.007.164.01.247.017.67.049 1.349.08 2.036.08.68 0 1.353-.031 2.02-.078.085-.007.17-.01.254-.017a28.556 28.556 0 001.98-.23l.17-.027a27.28 27.28 0 005.96-1.644c.07-.028.14-.054.209-.083a26.55 26.55 0 003.482-1.751c.169-.101.333-.208.5-.313.399-.253.79-.514 1.171-.787.085-.06.176-.112.258-.173l.832-.611-.024-.019C46.839 34.242 50 28.44 50 22zM1.818 22c0-11.249 10.4-20.4 23.182-20.4 12.783 0 23.182 9.151 23.182 20.4 0 6.062-3.023 11.511-7.808 15.25a7.046 7.046 0 00-.812-.43l-7.697-3.386c-.691-.304-1.12-.915-1.12-1.594v-2.366c.178-.193.366-.412.56-.653a15.675 15.675 0 002.379-4.099c1.152-.481 1.895-1.49 1.895-2.63v-2.837c0-.693-.289-1.366-.806-1.895v-3.734c.047-.415.214-2.758-1.712-4.69C31.386 7.251 28.674 6.4 25 6.4c-3.674 0-6.386.852-8.06 2.534-1.927 1.933-1.76 4.276-1.713 4.692v3.733c-.516.529-.806 1.202-.806 1.895v2.836c0 .881.449 1.703 1.218 2.257.736 2.539 2.252 4.46 2.812 5.111v2.316c0 .652-.405 1.252-1.056 1.566l-7.189 3.45a6.75 6.75 0 00-.683.381C4.796 33.434 1.818 28.018 1.818 22zM38.6 38.506c-.318.203-.642.4-.97.588-.15.086-.3.172-.454.256-.43.234-.866.456-1.311.664-.098.046-.198.09-.297.134a24.984 24.984 0 01-3.17 1.18l-.116.035c-.57.167-1.147.315-1.731.442h-.006c-.588.129-1.185.235-1.785.322l-.049.008c-.565.081-1.134.14-1.704.183-.102.008-.202.014-.304.02-.565.038-1.132.062-1.702.062-.576 0-1.15-.025-1.723-.062-.099-.007-.198-.012-.296-.02a26.58 26.58 0 01-1.718-.187l-.077-.012a25.714 25.714 0 01-3.536-.777l-.107-.032a25.577 25.577 0 01-1.693-.57l-.012-.005c-.525-.199-1.04-.42-1.55-.653-.066-.03-.133-.059-.199-.09a24.294 24.294 0 01-1.763-.924 23.39 23.39 0 01-1.216-.746l-.12-.084.086-.043 7.189-3.45c1.236-.594 2.004-1.732 2.004-2.971v-2.882l-.21-.222c-.02-.02-1.985-2.124-2.728-4.973l-.083-.317-.31-.177c-.437-.249-.699-.665-.699-1.113v-2.836c0-.372.18-.719.506-.979l.3-.238V13.58l-.008-.105c-.002-.02-.27-1.943 1.27-3.488C19.62 8.67 21.873 8 25 8c3.114 0 5.36.664 6.678 1.973 1.538 1.529 1.287 3.489 1.285 3.505l-.008 4.56.3.239c.326.259.506.606.506.978v2.836c0 .57-.441 1.088-1.074 1.26l-.451.123-.146.396a14.179 14.179 0 01-2.27 4.025c-.237.296-.47.559-.668.76l-.226.226v2.959c0 1.29.815 2.45 2.126 3.026l7.697 3.386.145.066c-.097.065-.197.125-.295.188z"
                        fill="#45496a"
                      />
                    </svg>
                  </a>
                </li>
              ) : (
                <>
                  {" "}
                  <li>
                    <a
                      href="/login"
                      className="block py-2 px-3 text-2xl  rounded hover:text-gray-300 md:hover:bg-transparent md:border-0 md:hover:text-gray-300 md:p-0  md:dark:hover:text-grey-200 dark:hover:bg-gray-700 dark:hover: md:dark:hover:bg-transparent"
                    >
                      Login
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
