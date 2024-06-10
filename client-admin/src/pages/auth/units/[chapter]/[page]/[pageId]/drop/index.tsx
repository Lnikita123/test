import NavBarPage from "@/components/atoms/navBarPage/navBarPage";
import React, { Suspense } from "react";
import PageLeftBar from "@/components/atoms/pageLeftBar/pageLeftBar";
import { usePageStore } from "@/store/usePageStore";
import DropPage from "@/components/atoms/drop/dropPage";
import FenstringBox from "@/components/atoms/fenstringBox/FenstringBox";
const Drop = () => {
  const drop = usePageStore((s) => s.drop);
  return (
    <Suspense fallback={<>Loading</>}>
      <div className="bg-blue-200 px-2 h-screen overflow-y-auto bg-cover">
        <NavBarPage />
        <hr />
        <div className="flex flex-row cursor-pointer">
          <PageLeftBar />
          <div className="m-10">
            {drop ? (
              <>
                <DropPage />
              </>
            ) : (
              <div className="absolute w-[25rem] top-1/2 bottom-1/2 left-1/2 right-1/2 text-xl">
                Please select any of the options
              </div>
            )}
            <div>{drop ? <FenstringBox /> : ""}</div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};
export default Drop;
