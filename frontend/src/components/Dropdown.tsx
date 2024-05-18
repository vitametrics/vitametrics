import { useAuth } from "../helpers/AuthContext";

const Dropdown = () => {
  const { logout } = useAuth();

  return (
    <div className="absolute top-0 mt-12 mr-5 right-[1rem] bg-white shadow-lg rounded-md overflow-hidden z-50 items-center text-center">
      <a
        href="/dashboard"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Dashboard
      </a>
      <a
        href="/settings"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Settings
      </a>
      <a
        onClick={() => logout()}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Logout
      </a>
    </div>
  );
};
export default Dropdown;
