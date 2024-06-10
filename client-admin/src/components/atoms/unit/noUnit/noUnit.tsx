import React from "react";

const NoUnit = ({ units, modal }: any) => {
  return (
    <>
      {units.length === 0 && !modal && (
        <p className="absolute top-1/2 left-1/2 text-[#01579B] text-center font-bold mx-53 my-53 text-xl">
          No units Added
        </p>
      )}
    </>
  );
};

export default NoUnit;
