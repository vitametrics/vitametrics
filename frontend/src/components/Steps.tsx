import { Suspense } from "react";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";

import collect from "../assets/images/collect.webp";
import collectSmall from "../assets/images/collect-small.webp";
import analyze from "../assets/images/graph-analyze.webp";
import monitor from "../assets/images/monitor.webp";

/*
const collect = lazy(() => import("../assets/images/collect.webp"));
const analyze = lazy(() => import("../assets/images/graph-analyze.webp"));
const monitor = lazy(() => import("../assets/images/monitor.webp"));
*/

interface SectionProps {
  title: string;
  src: string;
}

const RightText: React.FC<SectionProps> = ({ title, src }) => {
  return (
    <div className="flex flex-row box-border gap-10 sm:flex-col-reverse bg-[#e6e6e6] ">
      <div className="w-full h-full flex justify-center items-center p-20 flex-col sm:p-10">
        <div className="w-full bg-white h-[400px] rounded-2xl grid grid-cols-1  sm:ml-0 sm:relative sm:justify-self-center sm:w-[100%]">
          {/*}
          <img
            src={src}
            loading="lazy"
            className="w-full rounded-2xl h-[400px] object-cover sm:mr-0 sm:ml-0 sm:relative sm:justify-self-center"
  />*/}

          <LazyLoadImage
            effect="blur"
            placeholderSrc={collectSmall}
            src={src}
            height={400}
            alt="image-alt"
          />
        </div>
      </div>
      <div className="w-full h-full p-20 flex  flex-col box-border min-w-[500px] ">
        <h1
          className=" text-4xl font-bold mb-5 text-center"
          style={{
            background: "linear-gradient(to right, #000000 20%, #a3a3a3 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          {title}
        </h1>
        <p className="text-2xl text-[#373F51">
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
    <div className="flex flex-row box-border sm:flex-col gap-10 items-center p-20 sm:p-10 bg-[#202020]">
      <div className="w-[100%] h-full sm:p-10 flex p-20 backdrop-blur-xl flex-col box-border min-w-[500px] ">
        <h1
          className=" text-4xl font-bold mb-5 text-center"
          style={{
            background: "linear-gradient(to right, #ffffff 20%, #a3a3a3 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          {title}
        </h1>
        <p className="text-2xl text-white">
          {" "}
          Made for research, Physiobit gathers data from real fitbit user
          through their accounts. <br /> <br /> Through continuous logging,
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed <br />{" "}
          <br />
          do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
      <div className="w-[100%] h-full items-center justify-center  rounded-xl flex-col grid grid-cols-1">
        {/*}
        <img
          src={src}
          loading="lazy"
          className="w-full aspect-ratio rounded-2xl h-[400px] object-fill sm:mr-0 sm:ml-0 sm:relative sm:justify-self-center"
        /> */}
        <LazyLoadImage src={src} height={400} alt="image-alt" />
      </div>
    </div>
  );
};

const Steps = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <motion.section
        id="#steps"
        className="w-full h-full flex flex-col box-border pb-20 bg-white"
      >
        <div className="flex items-center justify-center bg-black p-5">
          <h3
            className=" text-5xl font-bold text-center"
            style={{
              background: "linear-gradient(to right, #C471F5 0%, #FA71CD 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            Research Just Got Easier.{" "}
          </h3>
        </div>
        <RightText title="Collect" src={collect} />
        <LeftText title="Monitor" src={monitor} />
        <RightText title="Analyze" src={analyze} />
      </motion.section>
    </Suspense>
  );
};

export default Steps;
