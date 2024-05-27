import { useSearchParams } from "react-router-dom";

const ViewDevice = () => {
  const [searchParams] = useSearchParams();
  const deviceId = searchParams.get("device"); // Get the device ID from URL

  return (
    <div>
      <h1>View Device</h1>
      {deviceId}
    </div>
  );
};

export default ViewDevice;
