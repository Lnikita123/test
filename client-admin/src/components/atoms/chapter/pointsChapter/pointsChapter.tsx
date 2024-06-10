import React from "react";

const PointsChapter = ({ newChapter, InputChange }: any) => {
  return (
    <>
      <label className="text-md font-bold text-black">Points allocated</label>
      <br />
      <input
        type="text"
        className="my-1 px-2 py-1 rounded-md border border-1 border-sky-500"
        value={newChapter?.points}
        name="points"
        onChange={InputChange}
        onClick={(e) => e.stopPropagation()}
      />
    </>
  );
};

export default PointsChapter;
