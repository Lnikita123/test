import Pageboard from "@/components/molecules/pageboard/pageboard";

import React from "react";

const LearnPage = () => {
  return (
    <>
      <div
        id="pageboard"
        className="bg-gray-100"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Pageboard />
      </div>
    </>
  );
};

export default LearnPage;
