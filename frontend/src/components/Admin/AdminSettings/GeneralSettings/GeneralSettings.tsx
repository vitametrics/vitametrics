import ChangeNotifEmail from "./ChangeNotifEmail";
const GeneralSettings = () => {
  return (
    <div className="w-full h-full flex flex-col bg-primary font-neueHassUnica">
      <div className="grid grid-cols-1 w-full gap-5">
        <ChangeNotifEmail />
      </div>
    </div>
  );
};

export default GeneralSettings;
