import { useAuth } from "../../../../helpers/AuthContext";

const ChangeNotifEmail = () => {
  const { userEmail } = useAuth();

  return (
    <span className="flex flex-col bg-primary">
      <span className="bg-primary2 text-white font-bold text-xl px-5 py-3">
        Change Notification Email
      </span>
      <div className="p-5 flex flex-col">
        <span className="bg-primary text-white text-lg mb-3 font-bold">
          Change the email address that will receive notifications.
        </span>
        <span className="bg-primary text-[#f5f5f5] pb-0 text-sm  mb-3">
          Current Email: {userEmail}
        </span>

        <span className="bg-primary text-secondary pb-0 text-md font-bold">
          Enter New Email
        </span>
        <input
          type="text"
          className="p-2 w-[300px] border-2 border-gray-200 rounded-lg mb-2"
        />
        <button className="bg-secondary text-white p-2 w-[200px] rounded-lg font-bold">
          Change Email
        </button>
      </div>
    </span>
  );
};

export default ChangeNotifEmail;
