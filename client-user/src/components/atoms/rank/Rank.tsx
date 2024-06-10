import { responsiveStyle } from "@/components/molecules/pageboard/topSection";
import React from "react";

const Rank = ({ rank }: any) => {
  return (
    <div className="flex items-center justify-between mt-3 h-[7rem] bg-[#FFFFFF] border-2 border-white rounded-md">
      <div className="flex">
        <img
          src="/rank.svg"
          alt="logo"
          width={120}
          height={150}
          className="mx-2"
        />
        <div className="flex flex-col mx-3">
          <div className="flex flex-row my-1 ml-5">
            <img src="/rankLogo.svg" alt="logo" width={20} height={50} />
            <p className=" font-bold text-2xl ml-3">Rank</p>
          </div>
          <p className="font-semibold text-sm ml-5">
            Lorum ipsum is a simply dummy text <br /> of the printing e printing
            adustry
          </p>
        </div>
      </div>
      <p className={`text-black font-bold mx-5 ${responsiveStyle}`}>{rank}</p>
    </div>
  );
};

export default Rank;
