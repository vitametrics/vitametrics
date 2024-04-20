import { motion } from "framer-motion";
import src from "../assets/images/preview.webp";
import src2 from "../assets/images/preview_2.webp";
//const src = lazy(() => import("../assets/images/collect.webp"));

const Steps = () => {
  const features = [
    "Data Export",
    "Data Visualization",
    "Participant Tracking",
    "Collaborative Research",
  ];

  const bulletPoint = (text: string) => {
    return (
      <div className="text-white text-3xl flex items-center font-leagueSpartan">
        <svg
          fill="#7D8BAE"
          width="24px"
          height="24px"
          viewBox="0 0 32 32"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          stroke="#7D8BAE"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path d="M30.885 15.116l-14.001-14c-0.226-0.226-0.539-0.366-0.884-0.366s-0.658 0.14-0.884 0.366l-14 14c-0.226 0.226-0.366 0.539-0.366 0.884s0.14 0.658 0.366 0.884l14 14.001c0.226 0.226 0.539 0.365 0.884 0.365s0.657-0.14 0.884-0.365l14.001-14.001c0.225-0.227 0.365-0.539 0.365-0.884s-0.139-0.657-0.365-0.884l0 0zM16 28.232l-12.232-12.232 12.232-12.232 12.232 12.232z"></path>{" "}
          </g>
        </svg>
        <div className="ml-5"> {text} </div>
      </div>
    );
  };

  return (
    <motion.section
      id="#steps"
      className="w-full h-full flex flex-col box-border px-10 lg:px-32 lg:pb-16 "
    >
      {" "}
      <div className="flex flex-col bg-glass rounded-lg p-12 lg:px-40 items-center mb-10">
        <h1 className="text-5xl text-primary text-center mb-5">
          {" "}
          Research Fitness Data Effortlessly.{" "}
        </h1>
        <p className="text-xl text-desc text-center font-leagueSpartan">
          {" "}
          All your fitness device metrics-- heart rate, steps, and more -- in
          one place{" "}
        </p>
        <div className="flex items-center justify-center gap-5 mt-5 text-white">
          <button className="bg-quaternary hover:bg-hoverQuaternary p-3 rounded-lg w-[175px] text-2xl">
            Get Started
          </button>
          <button className="bg-quinary hover:bg-hoverQuinary p-3 rounded-lg w-[175px] text-2xl">
            {" "}
            Demo{" "}
          </button>
        </div>
        <img
          src={src}
          className="w-full h-full rounded-2xl mt-5 bg-cover"
          alt="preview-1"
        />
      </div>
      <div className="flex flex-col bg-glass rounded-lg p-12 lg:px-40 items-center">
        <h1 className="text-5xl text-primary text-center mb-5">
          Open-source built for Research.
        </h1>
        <p className="text-xl text-desc text-center font-leagueSpartan">
          Extensive features built to make researching fitness data easier and
          organized.
        </p>
        <div className="flex items-center justify-center gap-5 mt-5 text-white">
          <button className="bg-secondary hover:bg-hoverSecondary p-3 rounded-lg w-[175px] text-2xl ">
            Get Started
          </button>
          <button className="bg-tertiary hover:bg-hoverTertiary p-3 rounded-lg w-[175px] text-2xl">
            {" "}
            Demo{" "}
          </button>
        </div>
        <div className="flex md:flex-row flex-col w-full mt-10">
          <div className="flex flex-col items-center w-full justify-center text-center text-white bg-quaternary p-12 rounded-tl-lg rounded-bl-lg">
            <h1 className="text-primary text-5xl"> Features </h1>
            <div className="flex flex-col gap-5 mt-5">
              {features.map((feature) => bulletPoint(feature))}
            </div>
            <button className="bg-secondary hover:bg-hoverSecondary p-3 rounded-lg w-[175px] text-2xl mt-5">
              Explore
            </button>
          </div>
          <div className="flex flex-col items-center w-full justify-center text-center text-white bg-quinary rounded-tr-lg rounded-br-lg pl-10">
            <img
              src={src2}
              alt="preview-2"
              className="h-[250px] w-full rounded-tl-lg rounded-bl-lg object-cover"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Steps;
