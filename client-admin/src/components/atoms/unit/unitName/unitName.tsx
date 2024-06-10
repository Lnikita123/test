import React from "react";

const UnitName = ({ newUnit, InputChange }: any) => {
  return (
    <>
      <label className="text-md font-bold text-black">Unit name</label>
      <br />
      <input
        type="text"
        className="px-4 py-2 rounded-lg w-64 h-8 mt-2"
        value={newUnit?.unitName || ""}
        name="unitName"
        onChange={InputChange}
      />
    </>
  );
};

export default UnitName;
