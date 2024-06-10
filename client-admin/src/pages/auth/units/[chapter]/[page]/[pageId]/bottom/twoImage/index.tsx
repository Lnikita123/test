import React from "react";
import NavBarPage from "@/components/atoms/navBarPage/navBarPage";
import TwoImageEditor from "./TwoImageEditor";
import BottomLeftBar from "@/components/atoms/bottomSectionBar/bottomLeftBar";
import { useBottomStore } from "@/store/useBottomStore";

const OneImage = () => {
  const twoImage = useBottomStore((s) => s.twoImage);
  return (
    <>
      <NavBarPage />
      <div className="flex">
        <BottomLeftBar />
        <div className="container mx-auto px-4 py-10">
          <div className="flex justify-start">
            {twoImage ? (
              <TwoImageEditor />
            ) : (
              <div className="absolute w-[25rem] top-1/2 bottom-1/2 left-1/2 right-1/2 text-xl">
                Please select any of the options
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OneImage;
