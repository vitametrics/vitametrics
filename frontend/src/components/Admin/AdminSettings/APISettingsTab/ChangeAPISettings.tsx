import ChangeBaseURL from "./Fields/ChangeBaseURL";
import ChangeViteAPI from "./Fields/ChangeViteAPI";
const ChangeAPISettings = () => {
  return (
    <span className="flex flex-col bg-primary">
      <span className="bg-primary2 text-white font-bold text-xl px-5 py-3">
        API Environment Variable Configurations
      </span>
      <ChangeBaseURL />
      <ChangeViteAPI />
    </span>
  );
};

export default ChangeAPISettings;
