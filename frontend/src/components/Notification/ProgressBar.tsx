import React from "react";

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="h-[10px] bg-[#e0e0df] relative w-full   overflow-hidden">
      <div
        className="bg-secondary h-[100%]"
        style={{
          width: `${progress}%`,
          transition: "width 0.1s linear",
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;
