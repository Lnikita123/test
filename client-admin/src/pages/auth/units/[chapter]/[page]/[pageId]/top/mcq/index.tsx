import React from "react";
import TopLeftBar from "@/components/atoms/topSetionBar/topLeftBar";
import NavBarPage from "@/components/atoms/navBarPage/navBarPage";
import MCQ from "./MCQ";

const Mcqs = () => {
  return (
    <>
      <NavBarPage />
      <div className="flex">
        <TopLeftBar />
        <div className="m-10">
          <MCQ />
        </div>
      </div>
    </>
  );
};

export default Mcqs;
