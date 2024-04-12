import { useAuth } from "../helpers/AuthContext";
import logo from "../assets/logo.png";
import { LogoutIcon } from "../assets/Logout";

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
          <img src={logo} className="h-[2rem] " alt="Physiobit Logo" />
        </a>{" "}
        <div className="flex items-center space-x-3">
          <a
            href="/"
            className="text-white hover:cursor-pointer"
            onClick={() => logout()}
          >
            <LogoutIcon />
          </a>
        </div>
      </div>
    </nav>
  );
};
