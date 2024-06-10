import React from "react";
import Link from "next/link";
import ProgressBar from "../progressBar/progressBar";

const Modules = () => {
  let progressValue = 40;
  return (
    <>
      <div className="flex">
        <div>
          <div className="text-center mt-[5rem]">
            <p className="font-bold text-md mb-2">
              This screen will is dummy replacement of gather town screens
            </p>
            <h1 className="text-3xl font-bold">
              Enter Chess Module to Continue
            </h1>
          </div>
          <div className="flex flex-wrap justify-center my-2">
            <div className="flex flex-wrap w-full justify-center">
              <Link href="/auth/units">
                <div className="w-[24rem] h-[10rem] m-2 rounded-lg overflow-hidden">
                  <div
                    className="bg-cover h-full"
                    style={{ backgroundImage: "url('/chess.svg')" }}
                  >
                    <p className="font-bold p-10 text-white flex text-2xl">
                      Chess
                    </p>
                  </div>
                </div>
              </Link>
              <Link href="#">
                <div className="w-[24rem] h-[10rem] m-2 rounded-lg overflow-hidden">
                  <div
                    className="bg-cover h-full"
                    style={{ backgroundImage: "url('/language.svg')" }}
                  >
                    <p className="font-bold p-10 text-white flex text-2xl">
                      Language Arts
                    </p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="flex flex-wrap w-full justify-center">
              <Link href="#">
                <div className="w-[24rem] h-[10rem] m-2 rounded-lg overflow-hidden">
                  <div
                    className="bg-cover h-full"
                    style={{ backgroundImage: "url('/juniorGamer.svg')" }}
                  >
                    <p className="font-bold p-10 text-white flex text-2xl">
                      Junior <br /> Gamer
                    </p>
                  </div>
                </div>
              </Link>
              <Link href="#">
                <div className="w-[24rem] h-[10rem] m-2 rounded-lg overflow-hidden">
                  <div
                    className="bg-cover h-full"
                    style={{ backgroundImage: "url('/BellClat.svg')" }}
                  >
                    <p className="font-bold p-10 text-white flex text-2xl">
                      Bell the Clat
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className=" bg-[#D2ECFF] border-[#D2ECFF] h-[12rem] w-[6rem] border mx-10 md:mt-[10rem]">
          <p className="text-[#283272] font-bold">My Profile</p>
          <img src="/logoImage.svg" alt="logo" className="h-[10rem] w-[5rem]" />
          <ProgressBar progress={progressValue} />
        </div>
      </div>
    </>
  );
};

export default Modules;
