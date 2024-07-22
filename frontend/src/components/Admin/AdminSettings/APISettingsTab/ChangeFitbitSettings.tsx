import ChangeClientID from "./Fields/ChangeClientID";
import ChangeClientSecret from "./Fields/ChangeClientSecret";
const ChangeFitbitSettings = () => {
  return (
    <span className="flex flex-col bg-primary">
      <span className="bg-primary2 text-white font-bold text-xl px-5 py-3">
        FitBit Environment Variable Configurations
      </span>
      <ChangeClientID />
      <ChangeClientSecret />
    </span>
  );
};

export default ChangeFitbitSettings;
