import React from "react";

const ChapterDescription = ({ newChapter, InputChange }: any) => {
  return (
    <>
      <label className="text-md font-bold text-black">
        Chapter description
      </label>
      <textarea
        className="border border-1 border-sky-500 truncate p-2 mt-1 rounded-md  h-24 w-72"
        value={newChapter?.chapterDescription || ""}
        name="chapterDescription"
        onChange={InputChange}
        onClick={(e) => e.stopPropagation()}
      ></textarea>
    </>
  );
};

export default ChapterDescription;
