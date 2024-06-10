import useStudent from "@/store/useStudent";
import { Avatar } from "@mui/material";
import React from "react";
import { AiOutlineHome, AiOutlineClose } from "react-icons/ai";
import { RxHamburgerMenu } from "react-icons/rx";
import { RiFullscreenFill, RiLogoutCircleLine } from "react-icons/ri";
import LogoutIcon from "./hamburgerLogout";
import { GoFullscreen } from "@/helpers/playComputer";
import { responsiveStyle } from "@/components/molecules/pageboard/topSection";
interface IHamburger {
  pages: any;
  currentPage: number;
  showHamburger: boolean;
  onClickHamburger: () => void;
  onClickHome: () => void;
}
const Hamburger = ({
  pages,
  currentPage,
  showHamburger,
  onClickHamburger,
  onClickHome,
}: IHamburger) => {
  const avatar = useStudent((s) => s.avatar);
  return (
    <div
      className={`flex flex-col justify-between ${
        !showHamburger ? "mx-2" : ""
      }`}
    >
      <div className="mt-3 cursor-pointer" onClick={onClickHamburger}>
        {!showHamburger && <RxHamburgerMenu />}
      </div>
      {showHamburger && (
        <div
          className="flex flex-col justify-between absolute right-0 w-20 bg-[#21055196] transition duration-300 ease-in-out"
          style={{
            boxShadow:
              "0px 1px 3px rgb(236 200 237 / 35%), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)",
            backdropFilter: "blur(18.5px)",
            borderRadius: "60px 0px 0px 60px",
            height: "88vh",
          }}
        >
          <div>
            <div className="m-10 cursor-pointer" onClick={onClickHamburger}>
              <AiOutlineClose color={"#fff"} size={24} />
            </div>
            <div className="m-10 cursor-pointer" onClick={onClickHome}>
              <AiOutlineHome color={"#fff"} size={24} />
            </div>
            <div className="m-10 cursor-pointer" onClick={GoFullscreen}>
              <RiFullscreenFill color={"#fff"} size={24} />
            </div>
            <div>
              <LogoutIcon />
            </div>
          </div>
          <div className="ml-4 mb-[2rem]">
            <Avatar
              alt={avatar}
              src={avatar}
              sx={{ width: 56, height: 56, backgroundColor: "#E0E4FC" }}
            />
          </div>
        </div>
      )}
      {pages && Object.keys(pages).length !== 0 && (
        <span
          style={{ fontFamily: "Sans" }}
          className={`${responsiveStyle} text-purple-600 flex justify-end mx-2`}
        >
          {pages ? currentPage + 1 + "/" + pages?.length : ""}
        </span>
      )}
    </div>
  );
};

export default Hamburger;
