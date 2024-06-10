import React from "react";

const ChapterNumber = ({ newChapter, InputChange }: any) => {
  return (
    <>
      <label className="font-bold">Chapter Number</label>
      <br />
      <input
        type="text"
        className=" my-1 px-2 py-1 border rounded-md border-1 border-sky-500"
        value={newChapter?.chapterNumber || null}
        name="chapterNumber"
        onChange={InputChange}
        onClick={(e) => e.stopPropagation()}
      />
      <br />
    </>
  );
};

export default ChapterNumber;
