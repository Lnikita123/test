import React from "react";
import NavBarPage from "@/components/atoms/navBarPage/navBarPage";
import MCQ from "./MCQ";
import BottomLeftBar from "@/components/atoms/bottomSectionBar/bottomLeftBar";
import { useBottomStore } from "@/store/useBottomStore";

const Mcqs = () => {
  const mcq = useBottomStore((s) => s.mcq);
  return (
    <>
      <NavBarPage />
      <div className="flex">
        <BottomLeftBar />
        <div className="m-10">
          {mcq ? (
            <MCQ />
          ) : (
            <div className="absolute w-[25rem] top-1/2 bottom-1/2 left-1/2 right-1/2 text-xl">
              Please select any of the options
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Mcqs;
