import { Suspense } from "react";
import { motion } from "framer-motion";
import collect from "../assets/images/collect.webp";
import analyze from "../assets/images/graph-analyze.png";
import monitor from "../assets/images/monitor.jpg";
interface SectionProps {
  title: string;
  src: string;
}

const RightText: React.FC<SectionProps> = ({ title, src }) => {
  return (
    <div className="flex flex-row box-border gap-10 sm:flex-col-reverse ">
      <div className="w-full h-full flex justify-center items-center p-20 flex-col sm:p-10">
        <div className="w-full bg-white h-[400px] rounded-2xl  sm:ml-0 sm:relative sm:justify-self-center sm:w-[100%]">
          <img
            src={src}
            className="w-full rounded-2xl h-[400px] object-cover sm:mr-0 sm:ml-0 sm:relative sm:justify-self-center"
          />
        </div>
      </div>
      <div className="w-full h-full p-20 flex  flex-col box-border min-w-[500px] ">
      <h1 className=" text-4xl font-bold mb-5 text-center"
          style={{background:"linear-gradient(to right, #000000 20%, #a3a3a3 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent"
        }}
          >
          {title}
        </h1>
        <p className="text-2xl font-bold text-[#373F51">
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

const LeftText: React.FC<SectionProps> = ({ title, src }) => {
  return (
    <div className="flex flex-row box-border sm:flex-col gap-10">
      <div className="w-[100%] h-full sm:p-10 flex p-20  flex-col box-border min-w-[500px] ">
      <h1 className=" text-4xl font-bold mb-5 text-center"
          style={{background:"linear-gradient(to right, #000000 20%, #a3a3a3 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent"
        }}
          >
          {title}
        </h1>
        <p className="text-2xl font-bold  text-[#373F51]">
          {" "}
          Made for research, Physiobit gathers data from real fitbit user
          through their accounts. <br /> <br /> Through continuous logging,
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed <br />{" "}
          <br />
          do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
      <div className="w-[100%] h-full flex items-center justify-center flex-col  p-20 sm:p-10">
        {/*<img src="" className="h-[300px] absolute t-10 rounded-2xl" />*/}
        <img
          src={src}
          className="w-full rounded-2xl h-[400px] object-fill sm:mr-0 sm:ml-0 sm:relative sm:justify-self-center"
        />
      </div>
    </div>
  );
};

const Steps = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <motion.section
        id="#steps"
        className="w-full h-full flex flex-col box-border pb-20 bg-[#EEEEEE] pt-10 font-leagueSpartanBold "
      >
             <h3 className=" text-5xl font-bold mb-5 text-center"
          style={{background:"linear-gradient(to right, #C471F5 0%, #FA71CD 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent"
        }}

          >
          Research Just Got Easier.{" "}
        </h3>
        <RightText title="Collect" src={collect} />
        <LeftText title="Monitor" src={monitor} />
        <RightText title="Analyze" src={analyze} />
      </motion.section>
    </Suspense>
  );
};

export default Steps;
