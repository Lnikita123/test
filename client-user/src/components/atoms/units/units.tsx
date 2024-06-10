import AccordionUnits from "@/components/molecules/accordionUnits/AccordionUnits";
import React from "react";
import NavigationBar from "../navigationBar/NavigationBar";

const Units = () => {
  return (
    <>
      <div className="relative bg-[#E9EDFF] h-screen bg-cover">
        <div className="fixed top-0 right-0 left-0 z-50 w-screen bg-[#E9EDFF]">
          <NavigationBar />
          <div className="flex flex-col relative">
            <div
              className="lg:h-[13rem] 2xl:h-[14rem] flex lg:justify-between xl:p-4 items-center rounded-lg lg:mx-5 2xl:mt-10 2xl:mx-10 2xl:mr-[2rem]"
              style={{
                background:
                  "linear-gradient(274.88deg, #765188 0%, rgba(38, 44, 85, 0.95) 86.33%)",
                boxShadow:
                  "0px 1px 3px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)",
                backdropFilter: "blur(18.5px)",
              }}
            >
              <div>
                <h1 className="lg:m-5 2xl:m-[2rem] font-bold md:text-2xl lg:text-3xl 2xl:text-5xl text-white">
                  Let's get started with chess...
                </h1>
                <p className="lg:m-5 2xl:m-[2rem] text-white lg:text-sm">
                  Learning chess rules takes one day, becoming good at chess takes longer. One proverb states, “Chess is a sea in which a gnat may drink and an elephant may bathe.” With intense efforts, chess greatness can be achieved.
                </p>
              </div>
              <img
                src="/unitImage.svg"
                alt="logo"
                className="lg:h-40 2xl:h-[13rem] 2xl:w-[20rem] "
              />
            </div>
          </div>
        </div>
        <div className="bg-[#E9EDFF] lg:mt-[19rem] 2xl:mt-[22rem]">
          <AccordionUnits />
        </div>
      </div>
    </>
  );
};

export default Units;
