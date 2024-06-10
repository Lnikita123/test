import Image from "next/image";
import React from "react";

const LogoText = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image src="/alvisText.svg" alt="text" width={100} height={100} />
      <h6 style={{ fontSize: "12px" }} className="font-semibold">
        Make scrolling exciting with virtual playground
      </h6>
    </div>
  );
};

export default LogoText;
