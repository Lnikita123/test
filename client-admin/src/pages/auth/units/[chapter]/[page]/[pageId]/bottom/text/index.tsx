import React from "react";
import NavBarPage from "@/components/atoms/navBarPage/navBarPage";
import TextEditor from "./TextEditor";
import BottomLeftBar from "@/components/atoms/bottomSectionBar/bottomLeftBar";
import { useBottomStore } from "@/store/useBottomStore";

const BottomSection = () => {
  const text = useBottomStore((S) => S.text);
  return (
    <>
      <NavBarPage />
      <div className="flex">
        <BottomLeftBar />
        <div className="container mx-auto px-4 py-10">
          {text ? (
            <TextEditor />
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

export default BottomSection;
