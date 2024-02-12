import { useState, useEffect } from "react";
import logo from "../assets/images/logo1.png";
import { useAuth } from "../helpers/AuthContext";
import ProfileIcon from "../assets/ProfileIcon";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.log("IsAuthenticated:", isAuthenticated);
  }, [isAuthenticated]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    //refresh
    window.location.reload();
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /*todos:
    -add url to login button

  */

  return (
    <nav className="bg-white border-gray-200 dark:bg-[#171619] dark:border-gray-700">
      <div className="flex flex-row w-full bg-[#373F51] dark:bg-[#171619] h-20 sticky top-0 flex-wrap items-center justify-between mx-auto p-4">
        <a
          href="/"
          className="flex items-center space-x-3 rtl:space-x-rev  erse"
        >
          <img src={logo} className="h-8" alt="Physiobit Logo" />
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
              } w-full md:hidden mt-4 border border-gray-100 text-white rounded-lg bg-[#1F1C23] md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-[#1F1C23] md:dark:bg-[#1F1C23] dark:border-[#1F1C23]`}
              id="navbar-dropdown"
            >
              <ul className="flex flex-col font-medium p-4 md:p-0">
                <li>
                  <a href="/" className="block py-2 px-3">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/FAQs" className="block py-2 px-3">
                    FAQs
                  </a>
                </li>
                {isAuthenticated ? (
                  <li>
                    <a href="/dashboard" className="block py-2 px-3">
                      Dashboard
                    </a>
                  </li>
                ) : (
                  <li>
                    <a href="/login" className="block py-2 px-3">
                      Login
                    </a>
                  </li>
                )}

                <li>
                  <a href="/contact" className="block py-2 px-3">
                    Contact
                  </a>
                </li>
                <li>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isDarkMode}
                      onChange={toggleDarkMode}
                    />
                    <span className="slider"> </span>
                  </label>
                </li>
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
                  href="/"
                  className="block py-2 px-3 text-lg text-white hover:text-gray-300 bg-transparent rounded md:bg-transparent  md:p-0  "
                  aria-current="page"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="/FAQs"
                  className="block py-2 px-3 text-lg text-white rounded hover:text-gray-300 md:hover:bg-transparent md:border-0 md:hover:text-gray-300 md:p-0  md:dark:hover:text-grey-200 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  FAQs
                </a>
              </li>

              {isAuthenticated ? (
                <li>
                  <a
                    href="/dashboard"
                    className="block py-2 px-3 text-lg text-white rounded hover:text-gray-300 md:hover:bg-transparent md:border-0 md:hover:text-gray-300 md:p-0  md:dark:hover:text-grey-200 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    <ProfileIcon />
                  </a>
                </li>
              ) : (
                <>
                  {" "}
                  <li>
                    <a
                      href="/login"
                      className="block py-2 px-3 text-lg text-white rounded hover:text-gray-300 md:hover:bg-transparent md:border-0 md:hover:text-gray-300 md:p-0  md:dark:hover:text-grey-200 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    >
                      Login
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact"
                      className="block py-2 px-3 text-lg text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-300 md:p-0 dark:text-white md:dark:hover:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    >
                      Contact
                    </a>
                  </li>
                </>
              )}

              <li>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={toggleDarkMode}
                  />
                  <span className="slider"> </span>
                </label>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
