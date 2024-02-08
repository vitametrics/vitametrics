const Features = () => {
  const symbol = ">";

  const featuresList = [
    "Track HR, GPS and Sleep data",
    "Easy User Management",
    "Export data",
    "Unlimited participant tracking",
    "Automated Graphing",
    "Open-souce",
  ];

  const firstThreeFeatures = featuresList.slice(0, 3);
  const nextThreeFeatures = featuresList.slice(3, 6);

  return (
    <section
      id="#features"
      className="w-full h-full flex flex-col box-border mb-[50px] "
    >
      <h3 className="text-5xl text-[#5086A2] dark:text-[#BA6767] font-bold mb-5 text-center">
        Features{" "}
      </h3>
      <div className="flex flex-row sm:flex-col">
        <div className="w-[100%] h-full p-10 flex  flex-col box-border min-w-[500px] lg:p-10 text-center">
          {firstThreeFeatures.map((feature) => (
            <h3 className="text-5xl text-[#5086A2] dark:text-[#BA6767] font-bold mb-5 text-left">
              {symbol}{" "}
              <span className="text-[#373F51] dark:text-white">
                {" "}
                {feature}{" "}
              </span>
            </h3>
          ))}
        </div>
        <div className="w-[100%] h-full p-10 flex  flex-col box-border min-w-[500px] lg:p-10 text-center">
          {nextThreeFeatures.map((feature) => (
            <h3 className="text-5xl text-[#5086A2] dark:text-[#BA6767] font-bold mb-5 text-left">
              {symbol}{" "}
              <span className="text-[#373F51] dark:text-white">
                {" "}
                {feature}{" "}
              </span>
            </h3>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
