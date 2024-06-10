import React from "react";

const SaveButton = ({ save }: any) => {
  return (
    <button
      onClick={save}
      type="button"
      className="bg-[#386A20] rounded-full text-white px-2 py-2 my-3"
    >
      Save
    </button>
  );
};

export default SaveButton;
