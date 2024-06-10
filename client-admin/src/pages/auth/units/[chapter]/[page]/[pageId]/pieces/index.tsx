import NavBarPage from "@/components/atoms/navBarPage/navBarPage";
import dynamic from "next/dynamic";
import React, { Suspense, memo } from "react";
import PageLeftBar from "@/components/atoms/pageLeftBar/pageLeftBar";
import { usePageStore } from "@/store/usePageStore";
import Fenstring from "@/components/atoms/piecePosition/Fenstring";
import FenstringBox from "@/components/atoms/fenstringBox/FenstringBox";

const WithMoveValidation = dynamic(
  () => import("@/integrations/WithMoveValidation"),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  }
);

function Piece() {
  const piece = usePageStore((s) => s.piece);
  return (
    <Suspense>
      <div className="bg-[#BDDFF6] max-w-full h-screen overflow-auto px-2 bg-cover">
        <NavBarPage />
        <hr />
        <div className="flex flex-row cursor-pointer">
          <PageLeftBar />
          <div className="mt-10 mx-5">
            {piece ? (
              <>
                <WithMoveValidation />
              </>
            ) : (
              <div className="absolute w-[25rem] top-1/2 bottom-1/2 left-1/2 right-1/2 text-xl">
                Please select any of the options
              </div>
            )}
            <div className={`my-5`}>{piece ? <Fenstring /> : ""}</div>
            <div>{piece ? <FenstringBox /> : ""}</div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

export default memo(Piece);
