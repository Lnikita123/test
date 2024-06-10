import NavBarPage from "@/components/atoms/navBarPage/navBarPage";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import PageLeftBar from "@/components/atoms/pageLeftBar/pageLeftBar";
import { usePageStore } from "@/store/usePageStore";
import MetaPage from "@/components/atoms/metaPage/meta";
const Chessboard = dynamic(() => import("chessboardjsx"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});
const Metatags = () => {
  const board = usePageStore((s) => s.board);
  const setBoard = usePageStore((S) => S.setBoard);
  const metaTags = usePageStore((s) => s.metaTags);
  const setMetaTags = usePageStore((S) => S.setMetaTags);
  return (
    <Suspense fallback={<>Loading</>}>
      <div className="bg-blue-200  min-h-screen overflow-auto">
        <NavBarPage />
        <hr />
        <div className="flex flex-row cursor-pointer">
          <PageLeftBar />
          <div className="m-10">
            {metaTags ? (
              <>
                <MetaPage />
              </>
            ) : (
              <div className="absolute w-[25rem] top-1/2 bottom-1/2 left-1/2 right-1/2 text-xl">
                Please select any of the options
              </div>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
};
export default Metatags;
