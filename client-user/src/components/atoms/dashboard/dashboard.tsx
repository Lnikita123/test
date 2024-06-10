import { useRouter } from "next/router";
import React from "react";
import NavigationBar from "../navigationBar/NavigationBar";
import { responsiveStyle } from "@/components/molecules/pageboard/topSection";

const Dashboard = () => {
  const router = useRouter();
  const handleStartLearning = () => {
    router.push("/auth/units");
  };
  const onClickPlay = () => {
    router.push("/play");
  };
  const onClickPuzzle = () => {
    router.push("/puzzle");
  };
  return (
    <div
      className="w-screen h-screen"
      style={{
        backgroundImage: "url('/backgroundImage.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "1%",
      }}
    >
      <NavigationBar />
      <div className="flex flex-row justify-around mt-3">
        <div>
          <div
            className="px-4 flex flex-col justify-around text-white rounded-xl border border-1 border-gray-500"
            style={{
              backgroundImage: "url('/bgImage.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "80vh",
              width: "45vw",
            }}
          >
            <p
              className={`2xl:ml-[2.3rem] 2xl:mt-[2rem] font-bold ${responsiveStyle} !text-3xl`}
            >
              Course
            </p>
            <h1
              className={`2xl:ml-[2.3rem] 2xl:mt-[2rem] font-bold ${responsiveStyle} mt-10`}
            >
              There are new Chess openings to discover and learn every day
            </h1>
            <p className={`2xl:ml-[2.3rem] 2xl:mt-[2rem] font-bold`}>
              Whatever the age, which ever the level, Play with Alvis gives you the edge to become a better Chess Player. While having fun!
            </p>
            <div>
              <button
                onClick={handleStartLearning}
                className="text-[#283272] bg-[#ECEFFF] rounded-full py-2 px-6 font-bold"
              >
                Start Learning
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-around ">
          <div
            onClick={() => onClickPuzzle()}
            style={{ height: "40vh", width: "50vw" }}
            className="cursor-pointer hover:scale-105 hover:duration hover:transition px-2 flex flex-row justify-between text-white bg-[#151b42] border-2 border-[#DDDDDD] rounded-lg"
          >
            <div className="p-2 flex flex-col justify-around">
              <p
                className={`${responsiveStyle} w-[10rem] border border-1 border-white rounded-xl px-3 py-2`}
              >
                Solve a Puzzle

              </p>
              <p>
                Solving puzzles will enhance your knowledge and understanding of chess principles  – like seeing the right move in a position that your opponent overlooked.

              </p>
              <h1 className={`${responsiveStyle} font-bold`}>
                Challenge your brain with <br />
                Puzzles!
              </h1>
            </div>
            <div className="flex place-items-center">
              <img
                src="/topImage.svg"
                alt="logo"
                className="z-100 my-10 max-w-full max-h-full"
              />
            </div>
          </div>
          <div
            onClick={() => onClickPlay()}
            style={{ height: "40vh", width: "50vw" }}
            className="cursor-pointer hover:scale-105 hover:duration hover:transition my-2 flex flex-row justify-between items-center bg-[#151b42] border-2 border-[#DDDDDD] rounded-lg"
          >
            <div className="p-2 text-white h-auto flex flex-col justify-between items-start">
              <p>
                Alvis is our friendly AI teacher and Jo is a warm, funny AI personality. Find an opponent that suits your style and is a pleasure to play with.

              </p>
              <h1 className={`${responsiveStyle} mt-2 font-bold`}>
                Play with computer
              </h1>
            </div>
            <div className="flex place-items-center">
              <img
                src="/bottomImage.svg"
                alt="logo"
                className="z-100 my-10 max-w-full max-h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
