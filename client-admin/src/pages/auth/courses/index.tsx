import LogoutButton from "@/components/atoms/logOut/logOut";
import Modules from "@/components/atoms/modules/modules";
import Image from "next/image";
import React from "react";

const Courses = () => {
  return (
    <>
      <div className="m-8 rounded-lg text-[#969696] text-center text-xs font-bold flex items-center justify-between">
        <div className="flex">

          <Image src="/alvis.svg" alt="logo" width={60} height={80} />
          <Image src="/alvisText.svg" alt="text" width={100} height={100} />
        </div>
        <LogoutButton />
      </div>
      <Modules />
    </>
  );
};

export default Courses;
