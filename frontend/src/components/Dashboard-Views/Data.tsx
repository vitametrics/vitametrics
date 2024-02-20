/* eslint-disable @typescript-eslint/no-explicit-any */
//import DatePicker from "react-datepicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
//import axios from "axios";

interface DataProps {
  devices: any[];
  orgName: string;
}

const Data: React.FC<DataProps> = ({ devices, orgName }) => {
  //const FETCH_ORG_ENDPOINT = import.meta.env.VITE_APP_FETCH_ORG_DEV_ENDPOINT; //~development;
  //const FETCH_ORG_ENDPOINT = import.meta.env.VITE_APP_FETCH_ORG_ENDPOINT;
  //const AUTH_ENDPOINT = import.meta.env.VITE_APP_AUTH_DEV_ENDPOINT; //~development;
  //const AUTH_ENDPOINT = import.meta.env.VITE_APP_AUTH_ENDPOINT; //~production;

  //
  //const FETCH_ORG_ENDPOINT = import.meta.env.VITE_APP_FETCH_ORG_ENDPOINT;
  const [dataType, setDataType] = useState("All");

  // State for date range
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  /*
  const fetchOrg = async () => {
    try {
      /*
      const auth_response = await axios.get(AUTH_ENDPOINT, {
        withCredentials: true,
      });

      if (auth_response.data.isAuthenticated === false) {
        console.log("User is not authenticated");
        return;
      }

      console.log(auth_response.data);*/

  //const orgId = auth_response.data.user.orgId;

  /*
      console.log(response.data);
      setOrgName(response.data.organization.orgName);
    } catch (error) {
      console.log(error);
    }
  };

  //use effect to fetch org upon load
  useEffect(() => {
    fetchOrg();
  }, []); // Include 'fetchOrg' in the dependency array
*/
  //console log the start and end date via useEffect
  useEffect(() => {
    console.log(startDate);
    console.log(endDate);
  }, [startDate, endDate]);

  const dataTypeOptions = [
    { value: "All", label: "All" },
    { value: "Heart Rate", label: "Heart Rate" },
    { value: "Sleep", label: "Sleep" },
    { value: "Nutrition", label: "Nutrition" },
    { value: "Steps", label: "Steps" },
    { value: "Calories", label: "Calories" },
    { value: "Blood Pressure", label: "Blood Pressure" },
    { value: "Blood Sugar", label: "Blood Sugar" },
    { value: "Oxygen", label: "Oxygen" },
  ];

  return (
    <div className="w-full h-full flex flex-col p-10 bg-[#FAF9F6] dark:bg-[#1E1D20] dark:bg-hero-texture">
      <h2 className="w-full text-4xl font-ralewayBold text-[#373F51] dark:text-white p-5 pb-0">
        {orgName} Overview
      </h2>
      <div className="flex flex-row p-5 w-full">
        {/* Data Type Dropdown */}
        <div className="mr-auto">
          <label
            htmlFor="dataType"
            className="block text-sm font-medium  text-[#373F51] dark:text-white"
          >
            Select Data Type:
          </label>
          <select
            id="dataType"
            name="dataType"
            value={dataType}
            onChange={(e) => setDataType(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          >
            <option value="defaultDataType" disabled>
              -- Select Data Type --
            </option>
            {dataTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-row w-full gap-5">
          <div className="ml-auto">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium  text-[#373F51] dark:text-white"
            >
              Select Start Date:
            </label>
            <DatePicker
              selected={startDate}
              onChange={(e: React.SetStateAction<any>) => setStartDate(e)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className=" p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium  text-[#373F51] dark:text-white"
            >
              Select End Date:
            </label>
            <DatePicker
              selected={endDate}
              onChange={(e: React.SetStateAction<any>) => setEndDate(e)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
        </div>
      </div>
      <div className="p-5 w-full">
        <div className="w-full h-[500px] bg-[#99BBCD] text-white dark:bg-[#2F2D2D] rounded-xl flex justify-center items-center mb-10">
          {" "}
          Insert Graph Here.{" "}
        </div>
        <div className="w-full h-[400px] bg-[#5086A2] text-white dark:bg-[#838383] rounded-xl flex flex-col mb-10">
          <h2 className="text-center w-full text-[#1B1B1B] p-5 text-4xl">
            Devices
          </h2>
          <div className="flex justify-center items-center h-full w-full">
            {devices.length > 0 ? (
              devices.map((device) => {
                return (
                  <div
                    key={device}
                    className="flex flex-row items-center  w-full h-[70px] bg-[#93C7E1] dark:bg-[#2E2E2E] rounded-xl p-5"
                  >
                    <p className="text-2xl font-bold text-white mr-auto ">
                      {device}
                    </p>
                  </div>
                );
              })
            ) : (
              <> No Devices Found</>
            )}
          </div>
        </div>
        <button className="p-5 text-2xl rounded-xl w-[250px] bg-[#93C7E1] dark:bg-[#AE6B69] text-white">
          Export
        </button>
      </div>
    </div>
  );
};

export default Data;
