import React from "react";

interface ITimersPlay {
  text: string;
  image: string;
  onClick: () => void;
  selected: string;
}

const TimersPlay = ({ text, image, onClick, selected }: ITimersPlay) => {
  return (
    <div className="2xl:mx-8 md:mx-2 my-1">
      <button
        onClick={onClick}
        className={`text-white flex items-center bg-gray-400 p-1 2xl:p-2 rounded-xl ${
          selected === text
            ? "pointer-events-none border border-1 border-yellow-200"
            : ""
        }`}
      >
        <img src={`${image}.png`} alt={image} className="mx-1" />
        <span className="mx-1">{text}</span>
      </button>
    </div>
  );
};

export default TimersPlay;
