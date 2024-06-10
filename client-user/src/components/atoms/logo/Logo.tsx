import Image from "next/image";
import React, { memo } from "react";

const Logo = () => {
  return (
    <div className="cursor-pointer">
      <Image
        src="/alvis.svg"
        alt="logo"
        width={60}
        height={80}
        className="m-2"
      />
    </div>
  );
};

export default memo(Logo);
