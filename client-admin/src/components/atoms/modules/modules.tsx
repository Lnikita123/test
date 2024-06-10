import Link from "next/link";
import React from "react";

const Modules = () => {
  return (
    <>
      <div className="flex flex-wrap justify-center my-2">
        <div className="flex flex-wrap w-full justify-center">
          <Link href="/auth/units">
            <div className="w-[24rem] h-[10rem] m-2 rounded-lg overflow-hidden">
              <div
                className="bg-cover h-full"
                style={{ backgroundImage: "url('/chess.svg')" }}
              >
                <p className="font-bold p-10 text-white flex text-2xl">Chess</p>
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
    </>
  );
};

export default Modules;
