import { responsiveStyle } from "@/components/molecules/pageboard/topSection";
import React from "react";

const Title = ({
  unitName,
  unitNumber,
  chapterName,
  chapterNumber,
  levels,
}: any) => {
  return (
    <div>
      <div
        style={{ fontFamily: "Sans" }}
        className={`flex flex-col items-center text-white capitalize rounded-xl py-2 px-1`}
      >
        <p className="md:text-xl 2xl:text-2xl mx-1 capitalize">
          {chapterName} - {chapterNumber}
        </p>
        <p className="md:text-md 2xl:text-xl mx-1 capitalize">
          level - {levels}
        </p>
      </div>
    </div>
  );
};

export default Title;
