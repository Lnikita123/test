import Image from "next/image";
import React from "react";

const MiniLogoText = () => {
  return (
    <>
      <Image
        src="/alvis.svg"
        alt="logo"
        width={60}
        height={80}
        className="mt-2 ml-2 md:mt-0"
      />
      <h6 className="font-bold md:text-md xl:text-xl flex flex-row ml-2 md:ml-5">
        Start your learning journey with Alvis
      </h6>
    </>
  );
};

export default MiniLogoText;
