import React from "react";

interface ITimerComputer {
  showStart: boolean;
  selectedTimer: number;
  formateTimer: (timer: number) => React.ReactNode;
  timer: number;
}

const TimerComputer = ({
  showStart,
  selectedTimer,
  formateTimer,
  timer,
}: ITimerComputer) => {
  return (
    <div className="self-center items-center absolute -bottom-10 flex mt-20">
      <span
        id="startTime"
        className="bg-[#8289B2] text-center text-white mx-2 py-1 px-10 2xl:w-[20rem] rounded-md"
        style={{ display: !showStart ? "block" : "none" }}
      >
        {selectedTimer / 60} Minutes
      </span>
      <span
        className="bg-[#665681] text-center text-white mx-2 py-1 px-10 2xl:w-[20rem] rounded-md"
        style={{ display: !showStart ? "block" : "none" }}
      >
        {formateTimer(timer)} Seconds
      </span>
    </div>
  );
};

export default TimerComputer;
