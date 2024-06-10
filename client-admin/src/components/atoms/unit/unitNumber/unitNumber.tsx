import React from "react";

const UnitNumber = ({ newUnit, InputChange }: any) => {
  return (
    <>
      <label className="text-md font-bold text-black my-2">Unit number</label>
      <input
        type="text"
        className="px-2 py-2 rounded-md border border-1 w-1/2 h-1/2 font-bold"
        value={newUnit?.unitNumber || null}
        name="unitNumber"
        onChange={InputChange}
      />
      <br />
      <br />
      <div className="relative flex flex-col items-start">
        <div className="flex justify-between w-full">
          <label className="text-md font-bold text-black my-2">Add level</label>
        </div>
        <div className="flex">
          <select
            name="levels"
            className="my-1 px-2 py-1 border rounded-md w-96 mr-2"
            onChange={InputChange}
            value={newUnit?.levels || "beginner"}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default UnitNumber;
