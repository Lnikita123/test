import { responsiveStyle } from "@/components/molecules/pageboard/topSection";
import { calculateEffectiveLearning } from "@/helpers/calculationsProgress";
import React, { useEffect, useState } from "react";

const EffectiveLearning = ({ percentage }: any) => {
  const [effectiveLearning, setEffectiveLearning] = useState<
    string | undefined
  >("");
  useEffect(() => {
    let effective_learning: string | undefined = "";
    effective_learning = calculateEffectiveLearning(percentage);
    setEffectiveLearning(effective_learning);
  }, [percentage]);
  return (
    <div className="flex items-center justify-between mt-3  h-[7rem]  bg-[#FFFFFF] border-2 border-white rounded-md">
      <div className="flex">
        <img
          src="/effective learning.svg"
          alt="logo"
          width={120}
          height={150}
          className="mx-2"
        />
        <div className="flex flex-col mx-3">
          <div className="flex flex-row my-1 ml-5">
            <img src="/learningLogo.svg" alt="logo" width={30} height={60} />
            <p className=" font-bold text-2xl ml-3">EffectiveLearning</p>
          </div>
          <p className="font-semibold text-sm ml-5">
            Lorum ipsum is a simply dummy text <br /> of the printing e printing
            adustry
          </p>
        </div>
      </div>
      <p className={`text-black font-bold mx-5 ${responsiveStyle}`}>
        {effectiveLearning}
      </p>
    </div>
  );
};

export default EffectiveLearning;
