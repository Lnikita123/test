import React from "react";
import TopLeftBar from "@/components/atoms/topSetionBar/topLeftBar";
import NavBarPage from "@/components/atoms/navBarPage/navBarPage";
import HintSection from "./HintSection";
import { useTopStore } from "@/store/useTopStore";

const Hint = () => {
  const hint = useTopStore((s) => s.hint);
  return (
    <>
      <NavBarPage />
      <div className="flex">
        <TopLeftBar />
        <div className="m-10">
          {hint ? (
            <HintSection />
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

export default Hint;
