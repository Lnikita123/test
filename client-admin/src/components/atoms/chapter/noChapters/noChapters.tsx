import React from "react";

const NoChapters = ({ chapters, chapterModal }: any) => {
  return (
    <div>
      {chapters.length === 0 && !chapterModal && (
        <p className="absolute top-1/2 left-1/2 text-[#01579B] text-center font-bold mx-53 my-53">
          No chapter Added
        </p>
      )}
    </div>
  );
};

export default NoChapters;
