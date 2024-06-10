import React from "react";
import { IoIosArrowBack } from "react-icons/io";
interface IGoHomeButton {
  onClick: () => void;
  showBack: boolean;
}

const GoHomeButton = ({ onClick, showBack }: IGoHomeButton) => {
  return (
    <button
      onClick={() => onClick()}
      className={`lg:mr-[15rem] 2xl:mr-[50rem] transition-transform duration-300 hover:scale-110 bg-[#583469] text-[#FFFFFF] px-5 py-2 rounded-full flex items-center`}
    >
      <IoIosArrowBack className="text-[#fff]" />
      <span className="text-[#fff] mx-1">Go Back</span>
    </button>
  );
};

export default GoHomeButton;
