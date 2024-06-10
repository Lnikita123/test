import { IProgressUnitStore } from "@/store/useInterfaceStore";
import React from "react";
const UnitProgressCard = ({ data }: any) => {
  let studentId: any = null;
  if (typeof window !== "undefined" && studentId !== undefined) {
    studentId = JSON.parse(localStorage?.getItem("studentId") || "null");
  }
  return (
    <>
      {data.map((unit: IProgressUnitStore, index: number) => (
        <div
          key={index}
          className="bg-white m-5 h-[13rem] w-[15rem] transition-transform duration-300 hover:scale-110 px-2 py-1 cursor-pointer capitalize font-bold border-2 border-[#583469] rounded-lg"
        >
          <p title={unit?.unitName} className="text-[#283272]">
            {unit?.unitName?.slice(0, 5)}
            {unit?.unitName && unit?.unitName?.length > 5 ? "..." : ""}
          </p>
          <img
            src="/unitLogo.svg"
            alt="logo"
            width={210}
            height={200}
            className="mt-2 ml-1"
          />
          <div className="flex flex-row justify-around items-center">
            <div>
              <img src="/rankLogo.svg" alt="logo" width={20} height={50} />
              <p className="capitalize" title={unit.levels}>
                {unit.levels && unit.levels[0]}
              </p>
            </div>
            <div>
              <img src="/accuracyLogo.svg" alt="logo" width={30} height={60} />
              <p>{Math.ceil(unit.accuracy)}%</p>
            </div>
            <div>
              <img src="/learningLogo.svg" alt="logo" width={30} height={60} />
              <p>{unit.effectiveLearning}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default UnitProgressCard;
