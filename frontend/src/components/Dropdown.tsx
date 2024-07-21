import { useAuth } from "../helpers/AuthContext";

const Dropdown = () => {
  const { logout, isOwner } = useAuth();

  return (
    <div className="absolute top-0 mt-12 mr-5 right-[1rem] bg-white shadow-lg rounded-md overflow-hidden z-50 items-center text-center border-2 border-gray-300">
      <a
        href="/dashboard"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
      >
        Dashboard
      </a>
      <a
        href="/dashboard/settings"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
      >
        Settings
      </a>
      {isOwner && (
        <a
          href="/dashboard/admin?view=overview"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
        >
          Admin
        </a>
      )}
      <a
        onClick={() => logout()}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:cursor-pointer"
      >
        Logout
      </a>
    </div>
  );
};
export default Dropdown;
