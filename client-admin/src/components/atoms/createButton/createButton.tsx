import React from "react";

const CreateButton = ({ create }: any) => {
  return (
    <>
      <button
        onClick={create}
        type="button"
        className="bg-[#ffffff] mx-2 transition-transform duration-300 hover:scale-110 hover:ring-sky-300 rounded-full border border-sky-500 text-[#01579B] px-4 py-2 my-3"
      >
        Create
      </button>
    </>
  );
};

export default CreateButton;
