import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/router";
import LogoutButton from "../logOut/logOut";
import BreadCrumbsPage from "../breadCrumbs/BreadCrumbsPage";
const NavBarPage = () => {
  const router = useRouter();
  function onClickBack() {
    router.back(); // Navigate to the previous page
  }
  return (
    <>
      <div className="flex flex-row justify-between items-center bg-[#FFFFFF] border-b">
        <div className="flex flex-row justify-between items-center">
          <div onClick={onClickBack}>
            <button className="transition-transform duration-300 hover:scale-110 bg-[#2F312C] mx-5 text-[#FFFFFF] px-5 py-2 rounded-full flex items-center">
              <IoIosArrowBack className="text-white mr-2" />
              <span>Back</span>
            </button>
          </div>
          <BreadCrumbsPage />
        </div>
        <div className="my-2 flex">
          <LogoutButton />
        </div>
      </div>
    </>
  );
};

export default NavBarPage;
