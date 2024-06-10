import React from "react";

const ChapterName = ({ newChapter, InputChange }: any) => {
  return (
    <>
      <br />
      <label className="text-md font-bold text-black">Chapter name</label>
      <br />
      <input
        type="text"
        className="truncate my-1 px-2 py-1 border rounded-md border-1 border-sky-500 px-4 py-2 rounded-lg w-64 h-8 mt-2"
        value={newChapter?.chapterName || ""}
        name="chapterName"
        onChange={InputChange}
        onClick={(e) => e.stopPropagation()}
      />
    </>
  );
};

export default ChapterName;
