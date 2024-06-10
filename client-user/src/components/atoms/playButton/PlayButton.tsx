import React from "react";

interface IPlayButton {
  onClick: () => void;
}
const PlayButton = ({ onClick }: IPlayButton) => {
  return (
    <div>
      <button
        className="bg-white mx-2 md:px-5 2xl:px-10 py-2  rounded-xl"
        onClick={onClick}
      >
        Play
      </button>
    </div>
  );
};

export default PlayButton;
