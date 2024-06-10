import React from "react";

interface IColorButton {
  onClick: () => void;
  selected: boolean;
  imageSrc: string;
  altText: string;
}

export default function ColorButton({
  onClick,
  selected,
  imageSrc,
  altText,
}: IColorButton) {
  return (
    <button
      onClick={onClick}
      className={`flex justify-center bg-gray-400 text-center text-[#765188] md:mx-5 2xl:mx-10 2xl:px-2 py-1 rounded-md my-2 ${
        selected ? "pointer-events-none border border-1 border-yellow-200" : ""
      }`}
    >
      <div className="h-1/2 w-1/2">
        <img src={imageSrc} alt={altText} />
      </div>
    </button>
  );
}
