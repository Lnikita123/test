import React from "react";
import TopLeftBar from "@/components/atoms/topSetionBar/topLeftBar";
import NavBarPage from "@/components/atoms/navBarPage/navBarPage";
import TextEditor from "./TextEditor";
import { useTopStore } from "@/store/useTopStore";

const TopSection = () => {
  const text = useTopStore((S) => S.text);
  return (
    <>
      <NavBarPage />
      <div className="flex">
        <TopLeftBar />
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

export default TopSection;
