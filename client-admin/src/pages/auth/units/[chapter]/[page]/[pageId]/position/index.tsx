import NavBarPage from "@/components/atoms/navBarPage/navBarPage";
import PageLeftBar from "@/components/atoms/pageLeftBar/pageLeftBar";
import { usePageStore } from "@/store/usePageStore";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
const InteractiveChessboard = dynamic(
  () => import("@/components/template/position/InteractiveChessboard"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);
function Position() {
  const position = usePageStore((s) => s.position);

  return (
    <Suspense>
      <div className="bg-[#BDDFF6] px-2 max-w-full h-screen overflow-auto">
        <NavBarPage />
        <hr />
        <div className="flex flex-row cursor-pointer w-100 h-max">
          <PageLeftBar />
          <div className="m-10">
            {position ? (
              <DndProvider backend={HTML5Backend}>
                <InteractiveChessboard />
              </DndProvider>
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
}
export default Position;
