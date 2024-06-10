import { responsiveStyle } from "@/components/molecules/pageboard/topSection";
import React from "react";

const Effort = ({ percentage }: any) => {
  let effort = "";
  if (percentage >= 95 && percentage <= 100) {
    effort = "Outstanding";
  } else if (percentage >= 90 && percentage < 95) {
    effort = "Excellent";
  } else if (percentage >= 80 && percentage < 90) {
    effort = "very good";
  } else if (percentage >= 70 && percentage < 80) {
    effort = "satisfactory";
  } else if (percentage < 70) {
    effort = "fair";
  }
  return (
    <div className="flex items-center justify-between mt-3  h-[7rem]  bg-[#FFFFFF] border-2 border-white rounded-md">
      <div className="flex">
        <img
          src="/effort.svg"
          alt="logo"
          width={120}
          height={150}
          className="mx-2"
        />
        <div className="flex flex-col mx-3">
          <div className="flex flex-row my-1 ml-5">
            <img src="/effortLogo.svg" alt="logo" width={30} height={60} />
            <p className=" font-bold text-2xl ml-3">Effort</p>
          </div>
          <p className="font-semibold text-sm ml-5">
            Lorum ipsum is a simply dummy text <br /> of the printing e printing
            adustry
          </p>
        </div>
      </div>
      <p className={`text-black font-bold mx-5 ${responsiveStyle} capitalize`}>
        {effort}
      </p>
    </div>
  );
};

export default Effort;
