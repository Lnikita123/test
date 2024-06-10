import { IuseUnitStore, useUnitStore } from "@/store/useUnitStore";
import React, { useState } from "react";
import Image from "next/image";
import UnitCards from "../../molecules/unit/unitCards/unitCards";
import LogoutButton from "@/components/atoms/logOut/logOut";
import BreadCrumbsUnits from "@/components/atoms/breadCrumbs/BreadCrumbsUnits";
import { v4 as uuidv4 } from "uuid";
const Unit = () => {
  const modal = useUnitStore((s) => s.modal);
  const setModal = useUnitStore((s) => s.setModal);
  const [filterLevel, setFilterLevel] = useState("");

  const handleFilterChange = (e: any) => {
    setFilterLevel(e.target.value);
  };
  const [newUnit, setNewUnit] = useState<IuseUnitStore>({
    id: uuidv4(),
    unitName: "",
    unitNumber: null,
    isPublished: false,
    levels: "beginner",
  });
  const toggleModal = () => {
    setNewUnit({
      id: uuidv4(),
      unitName: "",
      unitNumber: null,
      isPublished: false,
      levels: "beginner",
    });
    setModal(!modal);
  };
  return (
    <>
      <div className="relative mx-auto h-screen w-screen flex flex-col bg-white">
        <div className="flex justify-between items-center">
          <div>
            <button className="m-8 rounded-lg text-[#969696] text-center text-xs font-bold flex items-center justify-center">
              <Image
                src="/alvis.svg"
                alt="logo"
                width={50}
                height={70}
                className="mr-2"
              />
              <BreadCrumbsUnits />
            </button>
          </div>
          <div className="flex">
            <div>
              <button
                onClick={toggleModal}
                className="border-1 border-black hover:scale-110 transition-transform duration-300 focus:ring focus:ring-sky-300 ml-10 bg-[#F4F4F4] h-[3rem] w-[7rem] mx-3 p-3 rounded-full mr-6 text-[#01579B] text-center text-xs font-bold flex items-center justify-center"
              >
                Add unit
              </button>
            </div>
            <LogoutButton />
          </div>
        </div>
        <div className="flex self-end mr-5">
          <span className="text-xl font-semibold mr-3">Filter</span>
          <select onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div className="m-16 flex flex-row gap-20 flex-wrap ">
          {!modal && <UnitCards filterLevel={filterLevel} />}
        </div>
      </div>
    </>
  );
};

export default Unit;
