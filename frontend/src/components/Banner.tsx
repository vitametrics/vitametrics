import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import fitbitlogo from "../assets/fitbit.webp";
import garminlogo from "../assets/garmin.svg";

const Banner = () => {
  const history = useNavigate();
  function navigate(url: string) {
    history(url);
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
      className="w-full h-[700px] flex flex-row box-border p-20 mb-28 mt-24 items-center justify-center sm:flex-col bg-transparent font-leagueSpartanBold"
      ref={ref}
    >
      <div className="h-full flex flex-col box-border lg:p-10 items-center justify-center">
        <h1 className=" text-7xl lg:text-9xl text-primary text-center">
          Vitametrics.
        </h1>
        <div className="flex flex-row items-center justify-evenly w-full mb-10">
          <button
            onClick={() => navigate("/demo")}
            className="bg-secondary hover:bg-hoverSecondary text-white font-leagueSpartanBold w-[150px] lg:text-4xl text-2xl mt-5 py-2 px-5 lg:w-[200px] rounded-lg"
          >
            Demo
          </button>
          <button className="bg-tertiary hover:bg-hoverTertiary text-white font-leagueSpartanBold w-[150px] lg:text-4xl text-2xl mt-5 py-2 px-5 lg:w-[200px] rounded-lg">
            <a href="https://github.com/brandontranle/vitametrics">Download</a>
          </button>
        </div>
        <span className="text-[#b0b0b0] text-2xl mt-5"> SUPPORTS </span>
        <div className="flex flex-row justify-center gap-5 items-center w-full ">
          <img src={fitbitlogo} alt="Fitbit Logo" className="h-10" />
          <img src={garminlogo} alt="Garmin Logo" className="h-16" />
        </div>
      </div>
    </motion.section>
  );
};

export default Banner;
