import { useState, useEffect } from "react";
import { useAuth } from "../../helpers/AuthContext";
import { useNavigate } from "react-router-dom";
import imagePath from "../../assets/images/vitamix.webp";
import ProfileIcon from "../../assets/ProfileIcon";
import { Fragment } from "react";

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
    <nav className="bg-transparent px-10 md:px-32 py-5 nav fixed top-0 w-full z-50 animated-parent font-neueHassUnica">
      <div className="flex flex-row w-full bg-glass rounded-xl top-0 flex-wrap items-center justify-between mx-auto p-3 animated-container">
        <a
          href="/"
          className="flex items-center space-x-3 rtl:space-x-rev  erse"
        >
          <img
            fetchPriority="high"
            src={imagePath}
            className="h-10 w-[145px] rounded-xl border-2 border-gray-300"
            alt="VitametricsLogo"
          />
        </a>
        {windowWidth <= 755 ? (
          <Fragment>
            <button
              onClick={toggleDropdown}
              data-collapse-toggle="navbar-dropdown"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
              } w-full md:hidden mt-4 border border-gray-100  rounded-lg bg-transparent md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white `}
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
                      className="block py-2 px-3 text-xl font-bold"
                    >
                      Login
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </Fragment>
        ) : (
          <div
            className="hidden w-full md:block md:w-auto bg-transparent"
            id="navbar-default"
          >
            <ul className="font-medium flex flex-col justify-center items-center p-4 md:p-0 mt-4 border border-gray-100 rounded-lg  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 dark:bg-transparent md:dark:bg-transparent">
              {isAuthenticated ? (
                <a href="/dashboard">
                  <ProfileIcon />
                </a>
              ) : (
                <>
                  {" "}
                  <li>
                    <a
                      href="/login"
                      className="block py-2 px-3 text-2xl  rounded hover:text-hoverPrimary md:hover:bg-transparent md:border-0  md:p-0   font-bold"
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
