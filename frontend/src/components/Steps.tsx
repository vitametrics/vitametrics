import { Suspense } from "react";
import ResearchIcon from "../assets/ResearchIcon";
import MonitorIcon from "../assets/MonitorIcon";

interface SectionProps {
  title: string;
}

const RightText: React.FC<SectionProps> = ({ title }) => {
  return (
    <div className="flex flex-row box-border sm:flex-col-reverse ">
      <div className="w-[100%] h-full flex justify-center pt-20 pb-10 flex-col sm:p-10">
        {/* <img src="" className="h-[300px] absolute t-10 rounded-2xl" />*/}
        <div className="w-[375px] bg-white h-[400px] rounded-2xl absolute t-10 ml-[100px] sm:ml-0 sm:relative sm:justify-self-center sm:w-[100%]">
          {" "}
          <ResearchIcon/>
        </div>
        <div
          className="w-[750px] bg-[#79a3b7] dark:bg-[#151515] h-[350px] mr-auto rounded-tr-2xl rounded-br-2xl sm:hidden lg:hidden flex"
          id="square">
        </div>
      </div>
      <div className="w-[100%] h-full p-20 flex  flex-col box-border min-w-[500px] ">
        <h1 className="text-4xl text-[#5086A2] dark:text-[#bdbbbb] font-bold mb-5 text-center">
          {" "}
          {title}
        </h1>
        <p className="text-2xl font-bold text-[#373F51] dark:text-white">
          {" "}
          Made for research, Physiobit gathers data from real fitbit user
          through their accounts. <br /> <br /> Through continuous logging,
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed <br />{" "}
          <br />
          do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    </div>
  );
};

const LeftText: React.FC<SectionProps> = () => {
  return (
    <div className="flex flex-row box-border sm:flex-col">
      <div className="w-[100%] h-full sm:p-10 flex p-20  flex-col box-border min-w-[500px] ">
        <h1 className="text-4xl text-[#5086A2] dark:text-[#bdbbbb] font-bold mb-5 text-center">
          {" "}
        </h1>
        <p className="text-2xl font-bold  text-[#373F51] dark:text-white">
          {" "}
          Made for research, Physiobit gathers data from real fitbit user
          through their accounts. <br /> <br /> Through continuous logging,
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed <br />{" "}
          <br />
          do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
      <div className="w-[100%] h-full  pt-20 pb-10 flex justify-center flex-col min-w-[500px] sm:p-10">
        {/*<img src="" className="h-[300px] absolute t-10 rounded-2xl" />*/}
        <div className="w-[375px] bg-white h-[400px] rounded-2xl absolute mr-0 ml-[325px] sm:mr-0 sm:ml-0 sm:relative sm:justify-self-center sm:w-[100%]">
          {" "}
          <MonitorIcon/>

        </div>
        <div
          className="w-[750px] bg-[#79a3b7] dark:bg-[#151515] h-[350px] ml-auto rounded-bl-2xl rounded-tl-2xl sm:hidden lg:hidden"
          id="square"
        ></div>
      </div>
    </div>
  );
};

const Steps = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <section
        id="#steps"
        className="w-full h-full flex flex-col box-border mb-[100px] "
      >
        <h3 className="text-5xl text-[#5086A2] dark:text-[#BA6767] font-bold mb-5 text-center">
          Three Easy Steps
        </h3>
        <RightText title="Deploy" />
        <LeftText title="Monitor" />
        <RightText title="Study" />
      </section>
    </Suspense>
  );
};

export default Steps;
