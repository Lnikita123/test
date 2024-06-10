import React from "react";

const ProgressBar = ({ progress }: any) => {
  return (
    <div className="rounded-lg relative w-100 bg-[#FAEEFF] h-40">
      <div
        style={{ height: `${progress}%` }}
        className="text-white absolute bottom-0 w-full bg-[#A67DB9]"
      >
        My Progress
      </div>
    </div>
  );
};

export default ProgressBar;
