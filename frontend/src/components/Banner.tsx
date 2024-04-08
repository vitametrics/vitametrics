import Graph from "../assets/Graph";
import GithubSmallIcon from "../assets/GithubSmallIcon";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useHistory } from "react-router-dom";

const Banner = () => {
  const history = useHistory();
  function navigate(url: string) {
    history.push(url);
  }

  const fadeInItemVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  const { ref, inView } = useInView({
    threshold: 0.1, // Adjust based on when you want the animation to trigger (1 = fully visible)
    triggerOnce: true, // Ensures the animation only plays once
  });

  return (
    <motion.section
      id="#home"
      variants={fadeInItemVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className="w-full h-full flex flex-row box-border mb-28 mt-10 sm:flex-col bg-dark-gradient font-leagueSpartanBold"
      ref={ref}
    >
      <div className="w-[100%] h-full p-20 flex flex-col box-border min-w-[500px] lg:p-10">
        <h1 className="text-6xl text-white font-bold mb-5 sm:text-center">
          A Better Way
        </h1>
        <h2 className="gradient-light-blue font-bold mb-5 sm:text-center text-5xl">
          to analyze fitness data
        </h2>
        <p className="text-4xl font-bold text-white">
          {" "}
          Expand your research potential using Fitbit devices and our intuitive
          dashboard made for researchers.
        </p>
        <div className="flex flex-row gap-5 mt-10">
          <button
            onClick={() => navigate("/demo?view=devices")}
            className="p-3 text-3xl flex flex-row gap-2 justify-center items-center rounded-xl w-[230px] bg-pink-gradient text-white"
          >
            Demo
          </button>
          <button className="p-3 text-3xl flex flex-row justify-center gap-2 items-center rounded-xl w-[230px] bg-[#D9D9D9] text-black">
            <GithubSmallIcon />
            Github
          </button>
        </div>
      </div>
      <div className="w-full h-full flex justify-center flex-col min-w-[500px] lg:p-10 sm:p-10 pt-20 pb-20 items-center ">
        <Graph />
      </div>
    </motion.section>
  );
};

export default Banner;
