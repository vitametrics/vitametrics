import { useAuth } from "../helpers/AuthContext";
import logo from "../assets/logo.webp";

export const DashboardNavbar = () => {
  //const { isAuthenticated } = useAuth();
  const { logout } = useAuth();

  return (
    <nav className="bg-[#161616] px-2">
      <div className="flex flex-row w-full bg-[#161616] top-0 flex-wrap items-center justify-between mx-auto py-3">
        <a
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse mr-auto"
        >
          <img src={logo} className="h-[2rem]" alt="Physiobit Logo" />
        </a>{" "}
        <div className="flex items-center space-x-3">
          <a
            href="/"
            className="text-white hover:cursor-pointer"
            onClick={() => logout()}
          >
            <svg
              width="25px"
              height="25px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M21 12L13 12"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
                <path
                  d="M18 15L20.913 12.087V12.087C20.961 12.039 20.961 11.961 20.913 11.913V11.913L18 9"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
                <path
                  d="M16 5V4.5V4.5C16 3.67157 15.3284 3 14.5 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H14.5C15.3284 21 16 20.3284 16 19.5V19.5V19"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
              </g>
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
};
