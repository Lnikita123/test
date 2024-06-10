import React from "react";

interface IPlayButton {
  onClick: () => void;
  text: string;
}
const RestartGame = ({ onClick, text }: IPlayButton) => {
  return (
    <button
      className="bg-green-500 text-white mx-2 my-5 px-5 py-2 rounded-xl"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default RestartGame;
