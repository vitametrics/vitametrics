import Slider from "react-slick";
import { useEffect, useState } from "react";
//import DataIcon from "../assets/DataIcon";
import TrackingDataIcon from "../assets/TrackingDataIcon";
import ParticipantTrackingIcon from "../assets/ParticipantTrackingIcon";
import ExportDataIcon from "../assets/ExportDataIcon";
import DeviceTrackingIcon from "../assets/DeviceTrackingIcon";
import OpenSourceIcon from "../assets/OpenSourceIcon";
import GraphingIcon from "../assets/GraphingIcon";
import DataCollectionIcon from "../assets/DataCollectionIcon";

const Features = () => {
  const [slidesToShow, setSlidesToShow] = useState(3);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
  };

  const handleResize = () => {
    if (window.innerWidth >= 1100) {
      setSlidesToShow(3);
    } else if (window.innerWidth >= 768) {
      setSlidesToShow(2);
    } else {
      setSlidesToShow(1);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const features = [
    {
      title: "Tracking Data",
      desc: "Track health data not limited to heart rate, oxygen, calories, and more!",
      img: <TrackingDataIcon />,
    },
    {
      title: "Participants Management",
      desc: "Host an organization and manage all the members and their devices!",
      img: <ParticipantTrackingIcon />,
    },
    {
      title: "Export Data",
      desc: "Easily export collected data for analysis and reporting purposes.",
      img: <ExportDataIcon />,
    },
    {
      title: "Device Monitoring",
      desc: "Effortlessly what devices are connected along with their battery levels and more!",
      img: <DeviceTrackingIcon />,
    },
    {
      title: "Automated Graphing",
      desc: "Automate the process of creating insightful graphs and visualizations based on collected data.",
      img: <GraphingIcon />,
    },
    {
      title: "Open-source",
      desc: "Access and contribute to the source code for a transparent and collaborative platform.",
      img: <OpenSourceIcon />,
    },
    {
      title: "Limitless Data Collection",
      desc: "Collect and store data without limitations, ensuring comprehensive tracking and analysis.",
      img: <DataCollectionIcon />,
    },
  ];

  return (
    <section
      id="#features"
      className="w-full h-full flex flex-col box-border p-10 justify-center items-center bg-[#1A1A1A] font-leagueSpartanBold"
    >
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
      <h3 className="text-5xl gradient-light-blue font-bold mb-5 text-center">
        What do we offer you?
      </h3>
      <div className="p-10 w-full">
        <Slider {...settings}>
          {features.map((feature, index) => {
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center w-full lg:w-[450px] h-[360px] bg-[#93c6e1] dark:bg-[#0e0d0d] p-5 rounded-xl"
              >
                <div className="bg-grey-200 h-[200px] rounded-md mb-5 flex justify-center items-center">
                  {feature.img}
                </div>
                <p className="text-2xl text-[#373F51] gradient-pink-purple text-center">
                  {feature.title}
                </p>
                <p className="text-md text-[#373F51] dark:text-white text-center">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </Slider>
      </div>
    </section>
  );
};

export default Features;
