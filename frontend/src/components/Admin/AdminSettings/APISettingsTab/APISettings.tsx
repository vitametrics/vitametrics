import ChangeAPISettings from "./ChangeAPISettings";
import ChangeFitbitSettings from "./ChangeFitbitSettings";

const APISettings = () => {
  return (
    <div className="w-full h-full flex flex-col font-libreFranklin ">
      <div className="flex flex-col w-full gap-5">
        <ChangeAPISettings />
        <ChangeFitbitSettings />
      </div>
    </div>
  );
};

export default APISettings;
